import { prepareGiftPowers } from './prepare-data.js'

export const prepareGiftsContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.gifts

  // Part-specific data
  context.gifts = await prepareGiftPowers(actorData.gifts)
  context.renown = actorData.renown

  return context
}

export const prepareWolfContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.wolf

  // Part-specific data
  context.activeForm = actorData.activeForm
  context.forms = actorData.forms
  context.balance = actorData.balance

  return context
}
