export interface IColorTheme {
  dark: {[key: string]: string};
  light: {[key: string]: string};
}

export const colorTheme = {
  light: {
    // #region Text Colors Start
    text_primary: '7, 11, 17',
    text_secondary: '103, 116, 130',
    text_tertiary: '149, 164, 180',
    text_inverted: '255, 255, 255',
    text_positive: '0, 194, 112',
    text_negative: '255, 47, 1',

    // #endregion Text Colors End

    // #region Link Colors Start
    links_default: '63, 0, 255',
    links_active: '51, 92, 255',

    // #endregion Link Colors End

    // #region Background Colors Start
    bg_primary: '255, 255, 255',
    bg_secondary: '230, 234, 246',
    bg_inverted: '7, 11, 17',
    bg_overlay: '7, 11, 17',

    // #endregion Background Colors End

    // #region Surface Colors Start
    surface_primary: '255, 255, 255',
    surface_secondary: '230, 234, 246',
    surface_tertiary: '204, 214, 230',
    surface_inverted: '7, 11, 17',
    surface_overlay: '255, 255, 255',
    surface_navigation: '255, 255, 255',
    surface_counter: '255, 255, 255',
    surface_stroke: '204, 214, 230',
    surface_footer: '246, 247, 255',
    surface_quaternary: '255, 255, 255',
    surface_avatar_content: '255, 255, 255',
    surface_avatar_background: '180, 195, 210',

    // #endregion Surface Colors End

    // #region Icons Colors Start
    icon_primary: '7, 11, 17',
    icon_secondary: '103, 116, 130',
    icon_tertiary: '149, 164, 180',
    icon_inverted: '255, 255, 255',

    // #endregion Icons Colors Start

    // #region Controls Colors Start
    controls_inactive: '180, 195, 210',
    controls_disabled_primary: '219, 226, 237',
    controls_disabled_secondary: '204, 214, 230',
    controls_primary_default: '63, 0, 255',
    controls_primary_hover: '56, 0, 226',
    controls_primary_pressed: '50, 1, 200',
    controls_secondary_default: '230, 234, 246',
    controls_secondary_hover: '219, 226, 237',
    controls_secondary_pressed: '219, 226, 237',
    controls_inverted_default: '255, 255, 255',
    controls_inverted_hover: '246, 247, 255',
    controls_inverted_pressed: '230, 234, 246',
    controls_cell_selected: '246, 247, 255',
    controls_cell_pressed: '230, 234, 246',
    controls_tab_bar_active: '63, 0, 255',
    controls_tab_bar_inactive: '103, 116, 130',
    controls_tab_bar_bg: '255, 255, 255',
    controls_border_default: '204, 214, 230',
    controls_border_hover: '180, 195, 210',
    controls_border_focus: '102, 133, 255',
    controls_selector_default: '165, 180, 195',
    controls_selector_hover: '246, 247, 255',
    controls_list_selected: '246, 247, 255',
    controls_table_header: '246, 247, 255',
    controls_table_hover: '241, 244, 255',
    controls_table_selected: '204, 214, 255',
    controls_tab_hover: '180, 195, 210',
    controls_tab_pressed: '63, 0, 255',
    controls_switch_default: '230, 234, 246',
    controls_switch_hover: '246, 247, 255',
    controls_switch_active: '255, 255, 255',
    controls_tag_hover: '246, 247, 255',
    controls_tag_active: '230, 234, 246',
    controls_c360_default: '0, 0, 0',
    controls_c360_disabled: '18, 24, 31',
    controls_c360_hover: '12, 17, 24',
    controls_c360_pressed: '18, 24, 31',
    controls_alternative_default: '255, 255, 255',
    controls_alternative_pressed: '246, 247, 255',

    // #endregion Controls Colors Start

    // #region Highlight Colors Start
    accent_active: '63, 0, 255',
    accent_active_celestial: '29, 161, 242',
    accent_positive: '0, 194, 112',
    accent_warning: '255, 103, 0',
    accent_negative: '255, 47, 1',

    // #endregion Highlight Colors Start

    // #region Brand Colors Start
    brand_dark_blue: '0, 35, 102',
    brand_electric_blue: '63, 0, 255',
    brand_celestial_blue: '29, 161, 242',
    brand_orange: '255, 103, 0',
    brand_inverted: '255, 255, 255',

    // #endregion Brand Colors Start

    // #region Constants Colors Start
    // Grey
    grey_0: '255, 255, 255',
    grey_50: '246, 247, 255',
    grey_100: '230, 234, 246',
    grey_150: '219, 226, 237',
    grey_200: '204, 214, 230',
    grey_250: '180, 195, 210',
    grey_300: '165, 180, 195',
    grey_350: '149, 164, 180',
    grey_400: '125, 140, 155',
    grey_450: '103, 116, 130',
    grey_500: '81, 94, 107',
    grey_550: '66, 77, 88',
    grey_600: '50, 60, 71',
    grey_650: '39, 47, 57',
    grey_700: '33, 40, 49',
    grey_750: '26, 33, 41',
    grey_800: '18, 24, 31',
    grey_850: '12, 17, 24',
    grey_900: '7, 11, 17',

    // Blue
    blue_celestial_100: '229, 245, 255',
    blue_celestial_200: '205, 235, 254',
    blue_celestial_300: '153, 216, 255',
    blue_celestial_400: '83, 190, 255',
    blue_celestial_500: '29, 161, 242',
    blue_celestial_600: '0, 123, 199',
    blue_celestial_700: '0, 92, 148',
    blue_celestial_800: '0, 61, 98',
    blue_celestial_900: '0, 35, 56',

    // Green
    green_50: '211, 238, 226',
    green_100: '197, 255, 229',
    green_200: '154, 243, 204',
    green_300: '98, 227, 173',
    green_400: '47, 206, 139',
    green_500: '0, 194, 112',
    green_600: '0, 155, 90',
    green_700: '0, 155, 90',
    green_800: '0, 78, 45',
    green_900: '0, 41, 23',

    // Orange
    orange_50: '255, 227, 208',
    orange_100: '255, 225, 204',
    orange_200: '255, 194, 153',
    orange_300: '255, 164, 103',
    orange_400: '255, 133, 52',
    orange_500: '255, 103, 0',
    orange_600: '204, 82, 1',
    orange_700: '153, 62, 1',
    orange_800: '93, 37, 0',
    orange_900: '51, 21, 0',

    // Red
    red_50: '251, 223, 218',
    red_100: '255, 213, 204',
    red_200: '255, 172, 153',
    red_300: '255, 130, 103',
    red_400: '255, 89, 52',
    red_500: '223, 78, 47',
    red_600: '204, 38, 1',
    red_700: '153, 28, 1',
    red_800: '89, 17, 0',
    red_900: '51, 9, 0',

    // Pink
    pink_100: '255, 227, 251',
    pink_200: '255, 199, 247',
    pink_300: '254, 170, 244',
    pink_400: '254, 142, 240',
    pink_500: '254, 114, 236',
    pink_600: '218, 91, 201',
    pink_700: '181, 69, 167',
    pink_800: '145, 46, 132',
    pink_900: '108, 24, 98',

    // Yellow
    yellow_100: '255, 244, 204',
    yellow_200: '255, 233, 153',
    yellow_300: '255, 222, 102',
    yellow_400: '255, 211, 51',
    yellow_500: '255, 200, 0',
    yellow_600: '204, 160, 0',
    yellow_700: '153, 120, 0',
    yellow_800: '102, 80, 0',
    yellow_900: '51, 40, 0',

    // Blue
    blue_50: '228, 234, 255',
    blue_100: '204, 214, 255',
    blue_200: '153, 173, 255',
    blue_300: '102, 133, 255',
    blue_400: '51, 92, 255',
    blue_450: '55, 63, 255',
    blue_500: '63, 0, 255',
    blue_600: '50, 1, 200',
    blue_700: '37, 1, 150',
    blue_800: '25, 0, 100',
    blue_900: '12, 0, 50',

    // #endregion Constants Colors Start
  },
  dark: {
    // #region Text Colors Start
    text_primary: '255, 255, 255',
    text_secondary: '149, 164, 180',
    text_tertiary: '103, 116, 130',
    text_inverted: '7, 11, 17',
    text_positive: '0, 194, 112',
    text_negative: '255, 89, 52',

    // #endregion Text Colors End

    // #region Link Colors Start
    links_default: '102, 133, 255',
    links_active: '204, 214, 255',

    // #endregion Link Colors End

    // #region Background Colors Start
    bg_primary: '7, 11, 17',
    bg_secondary: '12, 17, 24',
    bg_inverted: '255, 255, 255',
    bg_overlay: '7, 11, 17',

    // #endregion Background Colors End

    // #region Surface Colors Start
    surface_primary: '26, 33, 41',
    surface_secondary: '33, 40, 49',
    surface_tertiary: '50, 60, 71',
    surface_inverted: '255, 255, 255',
    surface_overlay: '18, 24, 31',
    surface_navigation: '26, 33, 41',
    surface_counter: '7, 11, 17',
    surface_stroke: '50, 60, 71',
    surface_footer: '18, 24, 31',
    surface_quaternary: '50, 60, 71',
    surface_avatar_content: '149, 164, 180',
    surface_avatar_background: '39, 47, 57',

    // #endregion Surface Colors End

    // #region Icons Colors Start
    icon_primary: '255, 255, 255',
    icon_secondary: '149, 164, 180',
    icon_tertiary: '103, 116, 130',
    icon_inverted: '7, 11, 17',

    // #endregion Icons Colors Start

    // #region Controls Colors Start
    controls_inactive: '66, 77, 88',
    controls_disabled_primary: '33, 40, 49',
    controls_disabled_secondary: '50, 60, 71',
    controls_primary_default: '51, 92, 255',
    controls_primary_hover: '55, 63, 255',
    controls_primary_pressed: '63, 0, 255',
    controls_secondary_default: '33, 40, 49',
    controls_secondary_hover: '39, 47, 57',
    controls_secondary_pressed: '50, 60, 71',
    controls_inverted_default: '7, 11, 17',
    controls_inverted_hover: '12, 17, 24',
    controls_inverted_pressed: '18, 24, 31',
    controls_cell_selected: '18, 24, 31',
    controls_cell_pressed: '33, 40, 49',
    controls_tab_bar_active: '102, 133, 255',
    controls_tab_bar_inactive: '149, 164, 180',
    controls_tab_bar_bg: '26, 33, 41',
    controls_border_default: '66, 77, 88',
    controls_border_hover: '81, 94, 107',
    controls_border_focus: '102, 133, 255',
    controls_selector_default: '66, 77, 88',
    controls_selector_hover: '18, 24, 31',
    controls_list_selected: '39, 47, 57',
    controls_table_header: '12, 17, 24',
    controls_table_hover: '18, 24, 31',
    controls_table_selected: '33, 40, 49',
    controls_tab_hover: '39, 47, 57',
    controls_tab_pressed: '51, 92, 255',
    controls_switch_default: '18, 24, 31',
    controls_switch_hover: '26, 33, 41',
    controls_switch_active: '39, 47, 57',
    controls_tag_hover: '33, 40, 49',
    controls_tag_active: '50, 60, 71',
    controls_c360_default: '0, 0, 0',
    controls_c360_disabled: '230, 234, 246',
    controls_c360_hover: '246, 247, 255',
    controls_c360_pressed: '18, 24, 31',
    controls_alternative_default: '26, 33, 41',
    controls_alternative_pressed: '33, 40, 49',

    // #endregion Controls Colors Start

    // #region Highlight Colors Start
    accent_active: '51, 92, 255',
    accent_active_celestial: '29, 161, 242',
    accent_positive: '0, 194, 112',
    accent_warning: '255, 103, 0',
    accent_negative: '255, 89, 52',

    // #endregion Highlight Colors Start

    // #region Brand Colors Start
    brand_dark_blue: '0, 35, 102',
    brand_electric_blue: '63, 0, 255',
    brand_celestial_blue: '29, 161, 242',
    brand_orange: '255, 103, 0',
    brand_inverted: '0, 35, 102',

    // #endregion Brand Colors Start

    // #region Constants Colors Start
    // Grey
    grey_0: '255, 255, 255',
    grey_50: '246, 247, 255',
    grey_100: '230, 234, 246',
    grey_150: '219, 226, 237',
    grey_200: '204, 214, 230',
    grey_250: '180, 195, 210',
    grey_300: '165, 180, 195',
    grey_350: '149, 164, 180',
    grey_400: '125, 140, 155',
    grey_450: '103, 116, 130',
    grey_500: '81, 94, 107',
    grey_550: '66, 77, 88',
    grey_600: '50, 60, 71',
    grey_650: '39, 47, 57',
    grey_700: '33, 40, 49',
    grey_750: '26, 33, 41',
    grey_800: '18, 24, 31',
    grey_850: '12, 17, 24',
    grey_900: '7, 11, 17',

    // Blue
    blue_celestial_100: '229, 245, 255',
    blue_celestial_200: '205, 235, 254',
    blue_celestial_300: '153, 216, 255',
    blue_celestial_400: '83, 190, 255',
    blue_celestial_500: '29, 161, 242',
    blue_celestial_600: '0, 123, 199',
    blue_celestial_700: '0, 92, 148',
    blue_celestial_800: '0, 61, 98',
    blue_celestial_900: '0, 35, 56',

    // Green
    green_50: '211, 238, 226',
    green_100: '197, 255, 229',
    green_200: '154, 243, 204',
    green_300: '98, 227, 173',
    green_400: '47, 206, 139',
    green_500: '0, 194, 112',
    green_600: '0, 155, 90',
    green_700: '0, 155, 90',
    green_800: '0, 78, 45',
    green_900: '0, 41, 23',

    // Orange
    orange_50: '255, 227, 208',
    orange_100: '255, 225, 204',
    orange_200: '255, 194, 153',
    orange_300: '255, 164, 103',
    orange_400: '255, 133, 52',
    orange_500: '255, 103, 0',
    orange_600: '204, 82, 1',
    orange_700: '153, 62, 1',
    orange_800: '93, 37, 0',
    orange_900: '51, 21, 0',

    // Red
    red_50: '251, 223, 218',
    red_100: '255, 213, 204',
    red_200: '255, 172, 153',
    red_300: '255, 130, 103',
    red_400: '255, 89, 52',
    red_500: '223, 78, 47',
    red_600: '204, 38, 1',
    red_700: '153, 28, 1',
    red_800: '89, 17, 0',
    red_900: '51, 9, 0',

    // Pink
    pink_100: '255, 227, 251',
    pink_200: '255, 199, 247',
    pink_300: '254, 170, 244',
    pink_400: '254, 142, 240',
    pink_500: '254, 114, 236',
    pink_600: '218, 91, 201',
    pink_700: '181, 69, 167',
    pink_800: '145, 46, 132',
    pink_900: '108, 24, 98',

    // Yellow
    yellow_100: '255, 244, 204',
    yellow_200: '255, 233, 153',
    yellow_300: '255, 222, 102',
    yellow_400: '255, 211, 51',
    yellow_500: '255, 200, 0',
    yellow_600: '204, 160, 0',
    yellow_700: '153, 120, 0',
    yellow_800: '102, 80, 0',
    yellow_900: '51, 40, 0',

    // Blue
    blue_50: '228, 234, 255',
    blue_100: '204, 214, 255',
    blue_200: '153, 173, 255',
    blue_300: '102, 133, 255',
    blue_400: '51, 92, 255',
    blue_450: '55, 63, 255',
    blue_500: '63, 0, 255',
    blue_600: '50, 1, 200',
    blue_700: '37, 1, 150',
    blue_800: '25, 0, 100',
    blue_900: '12, 0, 50',

    // #endregion Constants Colors Start
  },
};

export type IColor = keyof typeof colorTheme.dark;
