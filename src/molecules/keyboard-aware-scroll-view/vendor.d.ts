// Вендорная копия react-native-keyboard-aware-scroll-view: файлы .js с
// Flow-аннотациями. Для tsc это синтаксические ошибки, а при них он выводит
// только их и до проверки типов остального проекта не доходит — то есть весь
// код оставался непроверенным. Объявляем модули здесь и не даём tsc читать сами
// файлы (allowJs выключен).
declare module './KeyboardAwareHOC' {
  const listenToKeyboardEvents: any;
  export default listenToKeyboardEvents;
}

declare module './KeyboardAwareScrollView' {
  const KeyboardAwareScrollView: any;
  export default KeyboardAwareScrollView;
}

declare module './KeyboardAwareFlatList' {
  const KeyboardAwareFlatList: any;
  export default KeyboardAwareFlatList;
}

declare module './KeyboardAwareSectionList' {
  const KeyboardAwareSectionList: any;
  export default KeyboardAwareSectionList;
}
