export class MoneyFormatValueConverter {
  toView(value) {
    return '$'+(+value).toFixed(2);
  }
}

