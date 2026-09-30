// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'market_snapshot_candle.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$MarketSnapshotCandle extends MarketSnapshotCandle {
  @override
  final DateTime date;
  @override
  final num open;
  @override
  final num high;
  @override
  final num low;
  @override
  final num close;

  factory _$MarketSnapshotCandle(
          [void Function(MarketSnapshotCandleBuilder)? updates]) =>
      (MarketSnapshotCandleBuilder()..update(updates))._build();

  _$MarketSnapshotCandle._(
      {required this.date,
      required this.open,
      required this.high,
      required this.low,
      required this.close})
      : super._();
  @override
  MarketSnapshotCandle rebuild(
          void Function(MarketSnapshotCandleBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MarketSnapshotCandleBuilder toBuilder() =>
      MarketSnapshotCandleBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MarketSnapshotCandle &&
        date == other.date &&
        open == other.open &&
        high == other.high &&
        low == other.low &&
        close == other.close;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, date.hashCode);
    _$hash = $jc(_$hash, open.hashCode);
    _$hash = $jc(_$hash, high.hashCode);
    _$hash = $jc(_$hash, low.hashCode);
    _$hash = $jc(_$hash, close.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MarketSnapshotCandle')
          ..add('date', date)
          ..add('open', open)
          ..add('high', high)
          ..add('low', low)
          ..add('close', close))
        .toString();
  }
}

class MarketSnapshotCandleBuilder
    implements Builder<MarketSnapshotCandle, MarketSnapshotCandleBuilder> {
  _$MarketSnapshotCandle? _$v;

  DateTime? _date;
  DateTime? get date => _$this._date;
  set date(DateTime? date) => _$this._date = date;

  num? _open;
  num? get open => _$this._open;
  set open(num? open) => _$this._open = open;

  num? _high;
  num? get high => _$this._high;
  set high(num? high) => _$this._high = high;

  num? _low;
  num? get low => _$this._low;
  set low(num? low) => _$this._low = low;

  num? _close;
  num? get close => _$this._close;
  set close(num? close) => _$this._close = close;

  MarketSnapshotCandleBuilder() {
    MarketSnapshotCandle._defaults(this);
  }

  MarketSnapshotCandleBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _date = $v.date;
      _open = $v.open;
      _high = $v.high;
      _low = $v.low;
      _close = $v.close;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MarketSnapshotCandle other) {
    _$v = other as _$MarketSnapshotCandle;
  }

  @override
  void update(void Function(MarketSnapshotCandleBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MarketSnapshotCandle build() => _build();

  _$MarketSnapshotCandle _build() {
    final _$result = _$v ??
        _$MarketSnapshotCandle._(
          date: BuiltValueNullFieldError.checkNotNull(
              date, r'MarketSnapshotCandle', 'date'),
          open: BuiltValueNullFieldError.checkNotNull(
              open, r'MarketSnapshotCandle', 'open'),
          high: BuiltValueNullFieldError.checkNotNull(
              high, r'MarketSnapshotCandle', 'high'),
          low: BuiltValueNullFieldError.checkNotNull(
              low, r'MarketSnapshotCandle', 'low'),
          close: BuiltValueNullFieldError.checkNotNull(
              close, r'MarketSnapshotCandle', 'close'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
