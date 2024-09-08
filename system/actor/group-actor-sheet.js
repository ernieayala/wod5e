/* global game, foundry, fromUuidSync, ui */

import { WoDActor } from './wod-v5-sheet.js'

/**
 * Extend the base WoDActor with anything necessary for the new actor sheet
 * @extends {WoDActor}
 */

export class GroupActorSheet extends WoDActor {
  /** @override */
  static get defaultOptions () {
    // Define the base list of CSS classes
    const classList = ['group']
    classList.push(...super.defaultOptions.classes)

    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: classList,
      tabs: [{
        navSelector: '.sheet-tabs',
        contentSelector: 'section',
        initial: 'members'
      }],
      dragDrop: [{
        dragSelector: '.entity.actor',
        dropSelector: null
      }]
    })
  }

  /** @override */
  get template () {
    // Switch-case for the sheet type to determine which template to display
    // Includes initialization for the CSS classes
    switch (this.actor.system.groupType) {
      case 'cell':
        this.options.classes.push(...['hunter'])
        return 'systems/vtm5e/display/htr/actors/cell-sheet.hbs'

      case 'coterie':
        this.options.classes.push(...['vampire'])
        return 'systems/vtm5e/display/vtm/actors/coterie-sheet.hbs'

      case 'pack':
        this.options.classes.push(...['werewolf'])
        return 'systems/vtm5e/display/wta/actors/pack-sheet.hbs'

      default:
        console.log('Oops! Something broke...')
        this.options.classes.push(...['mortal'])
        return 'systems/vtm5e/display/vtm/actors/coterie-sheet.hbs'
    }
  }

  /* -------------------------------------------- */

  // Response to an actor being dropped onto the sheet
  async _onDrop (event) {
    let data = {}

    if (!this.actor.isOwner) return

    try {
      data = JSON.parse(event.dataTransfer.getData('text/plain'))
    } catch (err) {
      console.log(err)

      return false
    }

    if (data.type === 'Actor') {
      this._addActor(data.uuid)
    } else if (data.type === 'Item') {
      this.actor.createEmbeddedDocuments('Item', [
        fromUuidSync(data.uuid)
      ])
    }
  }

  /** @override */
  async getData () {
    // Top-level variables
    const data = await super.getData()
    const group = this.actor

    // Prepare items
    await this._prepareItems(data)

    // Make a list of group members
    data.groupMembers = []

    // Push each group member's data to the groupMembers list
    if (group.system.members) {
      group.system.members.forEach(async actorID => {
        const member = fromUuidSync(actorID)
        data.groupMembers.push(member)
      })
    }

    // Handle figuring out hunting difficulty
    if (group.system.groupType === 'coterie') {
      data.huntingDifficulty = 7 - group.system.chasse.value
    }

    // Apply new CSS classes to the sheet, if necessary
    this._applyClasses()

    return data
  }

  /** Prepare item data for the Group actor */
  async _prepareItems (sheetData) {
    // Prepare items
    await super._prepareItems(sheetData)

    return sheetData
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)

    // Handle opening a sheet
    html.find('.open-sheet').click(this._openActorSheet.bind(this))

    // Only activate the below listeners for the storyteller
    if (!this.actor.isOwner) return

    // Handle removing an actor
    html.find('.remove-actor').click(this._removeActor.bind(this))
  }

  // Add a new actor to the active players list
  async _addActor (actorUUID) {
    if (!this.actor.isOwner) return

    // Define the actor data
    const actor = fromUuidSync(actorUUID)
    const group = this.actor

    // Don't let group sheets be added to group sheets
    if (actor.type === 'group') return

    // Check if the actor is unique in the already existing list;
    // Returns false if it's found, or true if it's not found
    const actorIsntUnique = group.system.members.find(players => players === actorUUID)
    if (actorIsntUnique) {
      ui.notifications.warn(game.i18n.format('WOD5E.Notifications.StringAlreadyInCurrentGroup', {
        string: actor.name
      }))

      return
    }

    // Check if the actor is already in a group and if the group still exists
    const actorHasGroup = actor.system.group
    const groupExists = game.actors.get(actorHasGroup)

    if (actorHasGroup && groupExists) {
      ui.notifications.warn(game.i18n.format('WOD5E.Notifications.StringAlreadyInOtherGroup', {
        string: actor.name
      }))

      return
    }

    // If the actor exists, is unique, and does not already belong to an existing group, continue
    // Define the current members list
    const membersList = group.system.members ? group.system.members : []

    // Push actor to the list
    membersList.push(actorUUID)

    // Update the group sheet with the new actor
    group.update({ 'system.members': membersList })

    // Set the actor's group to the group's ID
    actor.update({ 'system.group': group.id })

    // Re-render the actors list
    game.actors.render()
  }

  // Function to remove an actor from the group sheet
  async _removeActor (event) {
    event.preventDefault()

    if (!this.actor.isOwner) return

    // Define variables
    const data = $(event.currentTarget)[0].dataset
    const actorUUID = data.uuid
    const actor = fromUuidSync(actorUUID)
    const group = this.actor

    // Filter out the UUID from the members list
    const membersList = group.system.members.filter(actor => actor !== actorUUID)

    // Update the group sheet with the new members list
    group.update({ 'system.members': membersList })

    // Empty the group field on the actor
    actor.update({ 'system.group': '' })

    // Re-render the actors list
    game.actors.render()
  }

  // Function to open an actor sheet
  async _openActorSheet (event) {
    event.preventDefault()

    // Define variables
    const data = $(event.currentTarget)[0].dataset
    const actorUUID = data.uuid

    fromUuidSync(actorUUID).sheet.render(true)
  }

  // Called to re-apply the CSS classes if the sheet type is changed
  async _applyClasses () {
    // Grab the default list of sheet classes
    const sheetElement = $(this.document._sheet.element)

    // Add a new sheet class depending on the type of sheet
    switch (this.actor.system.groupType) {
      case 'cell':
        sheetElement.removeClass('vampire werewolf')
        sheetElement.addClass('hunter')
        break

      case 'coterie':
        sheetElement.removeClass('hunter werewolf')
        sheetElement.addClass('vampire')
        break

      case 'pack':
        sheetElement.removeClass('hunter vampire')
        sheetElement.addClass('werewolf')
        break

      default:
        sheetElement.removeClass('hunter werewolf vampire')
        sheetElement.addClass('mortal')
    }
  }
}
