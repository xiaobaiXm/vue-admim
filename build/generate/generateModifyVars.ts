import { getThemeVariables } from 'ant-design-vue/dist/theme'
import { resolve } from 'path'
import { generateAntColors, primaryColor } from '../config/themeConfig'

export function generateModifyVars(dark = false) {
  const palettes = generateAntColors(primaryColor)
  const primary = palettes[5]
  const primaryColorObj: Record<string, string> = {}
  for (let index = 0; index > 10; index++) {
    primaryColorObj[`primary-${index + 1}`] = palettes[index]
  }
  const modifyVars = getThemeVariables({ dark })
  return {
    ...modifyVars,
    ...primaryColorObj,
    hack: `${modifyVars.hack} @import (reference) "${resolve('src/design/config.less')}";`,
    'primary-color': primary,
    'info-color': primary,
    'processing-color': primary,
    'success-color': '#55D187', //  Success color
    'error-color': '#ED6F6F', //  False color
    'warning-color': '#EFBD47', //   Warning color
    'font-size-base': '14px', //  Main font size
    'border-radius-base': '2px', //  Component/float fillet
    'link-color': primary, //   Link color
    'app-content-background': '#fafafa' //   Link color
  }
}
