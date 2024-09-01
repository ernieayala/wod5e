/* global Hooks */

// Mortal
import { MortalActorSheet } from '../../actor/mortal-actor-sheet.js'
// Vampire system
import { VampireActorSheet } from '../../actor/vtm/vampire-actor-sheet.js'
import { GhoulActorSheet } from '../../actor/vtm/ghoul-actor-sheet.js'
// Hunter system
import { HunterActorSheet } from '../../actor/htr/hunter-actor-sheet.js'
// Werewolf system
import { WerewolfActorSheet } from '../../actor/wta/werewolf-actor-sheet.js'
// All systems
import { SPCActorSheet } from '../../actor/spc-actor-sheet.js'
import { GroupActorSheet } from '../../actor/group-actor-sheet.js'
import { BaseDefinitionClass } from './base-definition-class.js'

export class ActorTypes extends BaseDefinitionClass {
  // Run any necessary compilation on ready
  static onReady () {
    ActorTypes.setSortAlphabetically()
    ActorTypes.initializeLabels()
  }

  static mortal = {
    label: 'WOD5E.Mortal',
    types: ['mortal'],
    sheetClass: MortalActorSheet
  }

  static spc = {
    label: 'WOD5E.SPC.Label',
    types: ['spc'],
    sheetClass: SPCActorSheet
  }

  static vampire = {
    label: 'WOD5E.VTM.Label',
    types: ['vampire'],
    sheetClass: VampireActorSheet
  }

  static ghoul = {
    label: 'WOD5E.VTM.Ghoul',
    types: ['ghoul'],
    sheetClass: GhoulActorSheet
  }

  static hunter = {
    label: 'WOD5E.HTR.Label',
    types: ['hunter'],
    sheetClass: HunterActorSheet
  }

  static werewolf = {
    label: 'WOD5E.WTA.Label',
    types: ['werewolf'],
    sheetClass: WerewolfActorSheet
  }

  static group = {
    label: 'WOD5E.GroupSheet',
    types: ['group'],
    sheetClass: GroupActorSheet
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', ActorTypes.onReady)
