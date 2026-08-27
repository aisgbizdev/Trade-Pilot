// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'alert_level_row.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const AlertLevelRowLevelEnum _$alertLevelRowLevelEnum_entry =
    const AlertLevelRowLevelEnum._('entry');
const AlertLevelRowLevelEnum _$alertLevelRowLevelEnum_sl =
    const AlertLevelRowLevelEnum._('sl');
const AlertLevelRowLevelEnum _$alertLevelRowLevelEnum_tp1 =
    const AlertLevelRowLevelEnum._('tp1');
const AlertLevelRowLevelEnum _$alertLevelRowLevelEnum_tp2 =
    const AlertLevelRowLevelEnum._('tp2');

AlertLevelRowLevelEnum _$alertLevelRowLevelEnumValueOf(String name) {
  switch (name) {
    case 'entry':
      return _$alertLevelRowLevelEnum_entry;
    case 'sl':
      return _$alertLevelRowLevelEnum_sl;
    case 'tp1':
      return _$alertLevelRowLevelEnum_tp1;
    case 'tp2':
      return _$alertLevelRowLevelEnum_tp2;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<AlertLevelRowLevelEnum> _$alertLevelRowLevelEnumValues =
    BuiltSet<AlertLevelRowLevelEnum>(const <AlertLevelRowLevelEnum>[
  _$alertLevelRowLevelEnum_entry,
  _$alertLevelRowLevelEnum_sl,
  _$alertLevelRowLevelEnum_tp1,
  _$alertLevelRowLevelEnum_tp2,
]);

const AlertLevelRowSideEnum _$alertLevelRowSideEnum_buy =
    const AlertLevelRowSideEnum._('buy');
const AlertLevelRowSideEnum _$alertLevelRowSideEnum_sell =
    const AlertLevelRowSideEnum._('sell');

AlertLevelRowSideEnum _$alertLevelRowSideEnumValueOf(String name) {
  switch (name) {
    case 'buy':
      return _$alertLevelRowSideEnum_buy;
    case 'sell':
      return _$alertLevelRowSideEnum_sell;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<AlertLevelRowSideEnum> _$alertLevelRowSideEnumValues =
    BuiltSet<AlertLevelRowSideEnum>(const <AlertLevelRowSideEnum>[
  _$alertLevelRowSideEnum_buy,
  _$alertLevelRowSideEnum_sell,
]);

const AlertLevelRowDirectionEnum _$alertLevelRowDirectionEnum_above =
    const AlertLevelRowDirectionEnum._('above');
const AlertLevelRowDirectionEnum _$alertLevelRowDirectionEnum_below =
    const AlertLevelRowDirectionEnum._('below');

AlertLevelRowDirectionEnum _$alertLevelRowDirectionEnumValueOf(String name) {
  switch (name) {
    case 'above':
      return _$alertLevelRowDirectionEnum_above;
    case 'below':
      return _$alertLevelRowDirectionEnum_below;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<AlertLevelRowDirectionEnum> _$alertLevelRowDirectionEnumValues =
    BuiltSet<AlertLevelRowDirectionEnum>(const <AlertLevelRowDirectionEnum>[
  _$alertLevelRowDirectionEnum_above,
  _$alertLevelRowDirectionEnum_below,
]);

Serializer<AlertLevelRowLevelEnum> _$alertLevelRowLevelEnumSerializer =
    _$AlertLevelRowLevelEnumSerializer();
Serializer<AlertLevelRowSideEnum> _$alertLevelRowSideEnumSerializer =
    _$AlertLevelRowSideEnumSerializer();
Serializer<AlertLevelRowDirectionEnum> _$alertLevelRowDirectionEnumSerializer =
    _$AlertLevelRowDirectionEnumSerializer();

class _$AlertLevelRowLevelEnumSerializer
    implements PrimitiveSerializer<AlertLevelRowLevelEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'entry': 'entry',
    'sl': 'sl',
    'tp1': 'tp1',
    'tp2': 'tp2',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'entry': 'entry',
    'sl': 'sl',
    'tp1': 'tp1',
    'tp2': 'tp2',
  };

  @override
  final Iterable<Type> types = const <Type>[AlertLevelRowLevelEnum];
  @override
  final String wireName = 'AlertLevelRowLevelEnum';

  @override
  Object serialize(Serializers serializers, AlertLevelRowLevelEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  AlertLevelRowLevelEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      AlertLevelRowLevelEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$AlertLevelRowSideEnumSerializer
    implements PrimitiveSerializer<AlertLevelRowSideEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'buy': 'buy',
    'sell': 'sell',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'buy': 'buy',
    'sell': 'sell',
  };

  @override
  final Iterable<Type> types = const <Type>[AlertLevelRowSideEnum];
  @override
  final String wireName = 'AlertLevelRowSideEnum';

  @override
  Object serialize(Serializers serializers, AlertLevelRowSideEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  AlertLevelRowSideEnum deserialize(Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      AlertLevelRowSideEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$AlertLevelRowDirectionEnumSerializer
    implements PrimitiveSerializer<AlertLevelRowDirectionEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'above': 'above',
    'below': 'below',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'above': 'above',
    'below': 'below',
  };

  @override
  final Iterable<Type> types = const <Type>[AlertLevelRowDirectionEnum];
  @override
  final String wireName = 'AlertLevelRowDirectionEnum';

  @override
  Object serialize(Serializers serializers, AlertLevelRowDirectionEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  AlertLevelRowDirectionEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      AlertLevelRowDirectionEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$AlertLevelRow extends AlertLevelRow {
  @override
  final AlertLevelRowLevelEnum level;
  @override
  final AlertLevelRowSideEnum side;
  @override
  final String price;
  @override
  final AlertLevelRowDirectionEnum direction;
  @override
  final DateTime triggeredAt;
  @override
  final String triggeredPrice;
  @override
  final DateTime cancelledAt;

  factory _$AlertLevelRow([void Function(AlertLevelRowBuilder)? updates]) =>
      (AlertLevelRowBuilder()..update(updates))._build();

  _$AlertLevelRow._(
      {required this.level,
      required this.side,
      required this.price,
      required this.direction,
      required this.triggeredAt,
      required this.triggeredPrice,
      required this.cancelledAt})
      : super._();
  @override
  AlertLevelRow rebuild(void Function(AlertLevelRowBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AlertLevelRowBuilder toBuilder() => AlertLevelRowBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AlertLevelRow &&
        level == other.level &&
        side == other.side &&
        price == other.price &&
        direction == other.direction &&
        triggeredAt == other.triggeredAt &&
        triggeredPrice == other.triggeredPrice &&
        cancelledAt == other.cancelledAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, level.hashCode);
    _$hash = $jc(_$hash, side.hashCode);
    _$hash = $jc(_$hash, price.hashCode);
    _$hash = $jc(_$hash, direction.hashCode);
    _$hash = $jc(_$hash, triggeredAt.hashCode);
    _$hash = $jc(_$hash, triggeredPrice.hashCode);
    _$hash = $jc(_$hash, cancelledAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AlertLevelRow')
          ..add('level', level)
          ..add('side', side)
          ..add('price', price)
          ..add('direction', direction)
          ..add('triggeredAt', triggeredAt)
          ..add('triggeredPrice', triggeredPrice)
          ..add('cancelledAt', cancelledAt))
        .toString();
  }
}

class AlertLevelRowBuilder
    implements Builder<AlertLevelRow, AlertLevelRowBuilder> {
  _$AlertLevelRow? _$v;

  AlertLevelRowLevelEnum? _level;
  AlertLevelRowLevelEnum? get level => _$this._level;
  set level(AlertLevelRowLevelEnum? level) => _$this._level = level;

  AlertLevelRowSideEnum? _side;
  AlertLevelRowSideEnum? get side => _$this._side;
  set side(AlertLevelRowSideEnum? side) => _$this._side = side;

  String? _price;
  String? get price => _$this._price;
  set price(String? price) => _$this._price = price;

  AlertLevelRowDirectionEnum? _direction;
  AlertLevelRowDirectionEnum? get direction => _$this._direction;
  set direction(AlertLevelRowDirectionEnum? direction) =>
      _$this._direction = direction;

  DateTime? _triggeredAt;
  DateTime? get triggeredAt => _$this._triggeredAt;
  set triggeredAt(DateTime? triggeredAt) => _$this._triggeredAt = triggeredAt;

  String? _triggeredPrice;
  String? get triggeredPrice => _$this._triggeredPrice;
  set triggeredPrice(String? triggeredPrice) =>
      _$this._triggeredPrice = triggeredPrice;

  DateTime? _cancelledAt;
  DateTime? get cancelledAt => _$this._cancelledAt;
  set cancelledAt(DateTime? cancelledAt) => _$this._cancelledAt = cancelledAt;

  AlertLevelRowBuilder() {
    AlertLevelRow._defaults(this);
  }

  AlertLevelRowBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _level = $v.level;
      _side = $v.side;
      _price = $v.price;
      _direction = $v.direction;
      _triggeredAt = $v.triggeredAt;
      _triggeredPrice = $v.triggeredPrice;
      _cancelledAt = $v.cancelledAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AlertLevelRow other) {
    _$v = other as _$AlertLevelRow;
  }

  @override
  void update(void Function(AlertLevelRowBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AlertLevelRow build() => _build();

  _$AlertLevelRow _build() {
    final _$result = _$v ??
        _$AlertLevelRow._(
          level: BuiltValueNullFieldError.checkNotNull(
              level, r'AlertLevelRow', 'level'),
          side: BuiltValueNullFieldError.checkNotNull(
              side, r'AlertLevelRow', 'side'),
          price: BuiltValueNullFieldError.checkNotNull(
              price, r'AlertLevelRow', 'price'),
          direction: BuiltValueNullFieldError.checkNotNull(
              direction, r'AlertLevelRow', 'direction'),
          triggeredAt: BuiltValueNullFieldError.checkNotNull(
              triggeredAt, r'AlertLevelRow', 'triggeredAt'),
          triggeredPrice: BuiltValueNullFieldError.checkNotNull(
              triggeredPrice, r'AlertLevelRow', 'triggeredPrice'),
          cancelledAt: BuiltValueNullFieldError.checkNotNull(
              cancelledAt, r'AlertLevelRow', 'cancelledAt'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
