/* global foundry */

// Preparation functions
import { prepareBiographyContext, prepareExperienceContext, prepareFeaturesContext, prepareEquipmentContext, prepareNotepadContext, prepareSettingsContext, prepareStatsContext, prepareLimitedContext } from './scripts/prepare-partials.js'
// Base actor sheet to extend from
import { WoDActor } from './wod-actor-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDActor document
 * @extends {WoDActor}
 */
export class MortalActorSheet extends HandlebarsApplicationMixin(WoDActor) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'actor', 'sheet', 'mortal'],
    actions: {}
  }

  static PARTS = {
    header: {
      template: 'systems/vtm5e/display/shared/actors/mortal-sheet.hbs'
    },
    tabs: {
      template: 'systems/vtm5e/display/shared/actors/parts/tab-navigation.hbs'
    },
    stats: {
      template: 'systems/vtm5e/display/shared/actors/parts/stats.hbs'
    },
    experience: {
      template: 'systems/vtm5e/display/shared/actors/parts/experience.hbs'
    },
    features: {
      template: 'systems/vtm5e/display/shared/actors/parts/features.hbs'
    },
    equipment: {
      template: 'systems/vtm5e/display/shared/actors/parts/equipment.hbs'
    },
    biography: {
      template: 'systems/vtm5e/display/shared/actors/parts/biography.hbs'
    },
    notepad: {
      template: 'systems/vtm5e/display/shared/actors/parts/notepad.hbs'
    },
    settings: {
      template: 'systems/vtm5e/display/shared/actors/parts/actor-settings.hbs'
    },
    banner: {
      template: 'systems/vtm5e/display/shared/actors/parts/type-banner.hbs'
    },
    limited: {
      template: 'systems/vtm5e/display/shared/actors/limited-sheet.hbs'
    }
  }

  tabs = {
    stats: {
      id: 'stats',
      group: 'primary',
      title: 'WOD5E.Tabs.Stats'
    },
    features: {
      id: 'features',
      group: 'primary',
      title: 'WOD5E.Tabs.MeritsFlaws'
    },
    biography: {
      id: 'biography',
      group: 'primary',
      title: 'WOD5E.Tabs.Biography'
    },
    equipment: {
      id: 'equipment',
      group: 'primary',
      title: 'WOD5E.Tabs.Equipment'
    },
    experience: {
      id: 'experience',
      group: 'primary',
      title: 'WOD5E.Tabs.Experience'
    },
    notepad: {
      id: 'notepad',
      group: 'primary',
      title: 'WOD5E.Tabs.Notes'
    },
    settings: {
      id: 'settings',
      group: 'primary',
      title: 'WOD5E.Tabs.Settings'
    }
  }

  async _prepareContext () {
    // Top-level variables
    const data = await super._prepareContext()

    return data
  }

  async _preparePartContext (partId, context, options) {
    // Inherit any preparation from the extended class
    context = { ...(await super._preparePartContext(partId, context, options)) }

    // Top-level variables
    const actor = this.actor

    // Prepare each page context
    switch (partId) {
      // Stats
      case 'stats':
        return prepareStatsContext(context, actor)

      // Experience
      case 'experience':
        return prepareExperienceContext(context, actor)

      // Features
      case 'features':
        return prepareFeaturesContext(context, actor)

      // Equipment
      case 'equipment':
        return prepareEquipmentContext(context, actor)

      // Biography
      case 'biography':
        return prepareBiographyContext(context, actor)

      // Notepad
      case 'notepad':
        return prepareNotepadContext(context, actor)

      // Settings
      case 'settings':
        return prepareSettingsContext(context, actor)

      // Limited view
      case 'limited':
        return prepareLimitedContext(context, actor)
    }

    return context
  }
}
