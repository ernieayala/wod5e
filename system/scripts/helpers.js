/* global Handlebars, game, WOD5E */

import { generateLocalizedLabel } from '../api/generate-localization.js'

/**
 * Define any helpers necessary for working with Handlebars
 * @return {Promise}
 */
export const loadHelpers = async function () {
  Handlebars.registerHelper('concat', function () {
    let outStr = ''
    for (const arg in arguments) {
      if (typeof arguments[arg] !== 'object') {
        outStr += arguments[arg]
      }
    }
    return outStr
  })

  Handlebars.registerHelper('ifeq', function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }

    return options.inverse(this)
  })

  Handlebars.registerHelper('ifnoteq', function (a, b, options) {
    if (a !== b) {
      return options.fn(this)
    }

    return options.inverse(this)
  })

  Handlebars.registerHelper('ifgr', function (a, b, options) {
    if (a > b) {
      return options.fn(this)
    }

    return options.inverse(this)
  })

  Handlebars.registerHelper('ifless', function (a, b, options) {
    if (a < b) {
      return options.fn(this)
    }

    return options.inverse(this)
  })

  Handlebars.registerHelper('or', function () {
    for (let i = 0; i < arguments.length - 1; i++) {
      if (arguments[i]) {
        return true
      }
    }

    return false
  })

  Handlebars.registerHelper('and', function (bool1, bool2) {
    return bool1 && bool2
  })

  Handlebars.registerHelper('x2', function (int) {
    return Number(int) * 2
  })

  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase()
  })

  Handlebars.registerHelper('toUpperCaseFirstLetter', function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  })

  Handlebars.registerHelper('splitArray', function (arr) {
    if (!Array.isArray(arr)) {
      return ''
    }

    return arr.join(',')
  })

  // Helper to define attributes lists
  Handlebars.registerHelper('getAttributesList', function () {
    return WOD5E.Attributes.getList({})
  })

  // Helper to define skills lists
  Handlebars.registerHelper('getSkillsList', function () {
    return WOD5E.Skills.getList({})
  })

  // Helper to define disciplines lists
  Handlebars.registerHelper('getDisciplinesList', function () {
    return WOD5E.Disciplines.getList({})
  })

  // Check whether an object is empty or not
  Handlebars.registerHelper('isNotEmpty', function (obj) {
    return Object.keys(obj).length > 0
  })

  Handlebars.registerHelper('generateLocalizedLabel', function (string, type) {
    return generateLocalizedLabel(string, type)
  })

  Handlebars.registerHelper('attrIf', function (attr, value, test) {
    if (value === undefined) return ''
    return value === test ? attr : ''
  })

  Handlebars.registerHelper('sortAbilities', function (unordered = {}) {
    if (!game.settings.get('vtm5e', 'chatRollerSortAbilities')) {
      return unordered
    }
    return Object.keys(unordered).sort().reduce(
      (obj, key) => {
        obj[key] = unordered[key]
        return obj
      },
      {}
    )
  })

  Handlebars.registerHelper('numLoop', function (num, options) {
    let ret = ''

    for (let i = 0, j = num; i < j; i++) {
      ret = ret + options.fn(i)
    }

    return ret
  })

  Handlebars.registerHelper('getEdgeName', function (key) {
    const edges = {
      arsenal: 'WOD5E.HTR.Arsenal',
      fleet: 'WOD5E.HTR.Fleet',
      ordnance: 'WOD5E.HTR.Ordnance',
      library: 'WOD5E.HTR.Library',
      improvisedgear: 'WOD5E.HTR.ImprovisedGear',
      globalaccess: 'WOD5E.HTR.GlobalAccess',
      dronejockey: 'WOD5E.HTR.DroneJockey',
      beastwhisperer: 'WOD5E.HTR.BeastWhisperer',
      sensetheunnatural: 'WOD5E.HTR.SenseTheUnnatural',
      repeltheunnatural: 'WOD5E.HTR.RepelTheUnnatural',
      thwarttheunnatural: 'WOD5E.HTR.ThwartTheUnnatural',
      artifact: 'WOD5E.HTR.Artifact'
    }
    return edges[key]
  })

  Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 2); // Pretty-prints with 2-space indentation
  })

  Handlebars.registerHelper('decrement', function(value) {
    return Math.max(value - 1, 1);
  });

  Handlebars.registerHelper('stripHTML', function (input) {
    if (typeof input !== 'string') {
      return input;
    }

    return input.replace(/<\/?[^>]+(>|$)/g, '');
  });

  Handlebars.registerHelper('cleanHtml', function (text) {
    return new Handlebars.SafeString(
      text
        .replace(/\\n/g, '')  // Remove escaped newlines
        .replace(/\\"/g, '"') // Replace escaped quotes
        .replace(/&rsquo;/g, '’') // Replace specific HTML entities
    );
  });
}
