// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trade_plan.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const TradePlanPreferredSideEnum _$tradePlanPreferredSideEnum_buy =
    const TradePlanPreferredSideEnum._('buy');
const TradePlanPreferredSideEnum _$tradePlanPreferredSideEnum_sell =
    const TradePlanPreferredSideEnum._('sell');
const TradePlanPreferredSideEnum _$tradePlanPreferredSideEnum_wait =
    const TradePlanPreferredSideEnum._('wait');

TradePlanPreferredSideEnum _$tradePlanPreferredSideEnumValueOf(String name) {
  switch (name) {
    case 'buy':
      return _$tradePlanPreferredSideEnum_buy;
    case 'sell':
      return _$tradePlanPreferredSideEnum_sell;
    case 'wait':
      return _$tradePlanPreferredSideEnum_wait;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<TradePlanPreferredSideEnum> _$tradePlanPreferredSideEnumValues =
    BuiltSet<TradePlanPreferredSideEnum>(const <TradePlanPreferredSideEnum>[
  _$tradePlanPreferredSideEnum_buy,
  _$tradePlanPreferredSideEnum_sell,
  _$tradePlanPreferredSideEnum_wait,
]);

Serializer<TradePlanPreferredSideEnum> _$tradePlanPreferredSideEnumSerializer =
    _$TradePlanPreferredSideEnumSerializer();

class _$TradePlanPreferredSideEnumSerializer
    implements PrimitiveSerializer<TradePlanPreferredSideEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'buy': 'buy',
    'sell': 'sell',
    'wait': 'wait',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'buy': 'buy',
    'sell': 'sell',
    'wait': 'wait',
  };

  @override
  final Iterable<Type> types = const <Type>[TradePlanPreferredSideEnum];
  @override
  final String wireName = 'TradePlanPreferredSideEnum';

  @override
  Object serialize(Serializers serializers, TradePlanPreferredSideEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  TradePlanPreferredSideEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      TradePlanPreferredSideEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$TradePlan extends TradePlan {
  @override
  final TradePlanPreferredSideEnum preferredSide;
  @override
  final TradeSide buy;
  @override
  final TradeSide sell;

  factory _$TradePlan([void Function(TradePlanBuilder)? updates]) =>
      (TradePlanBuilder()..update(updates))._build();

  _$TradePlan._(
      {required this.preferredSide, required this.buy, required this.sell})
      : super._();
  @override
  TradePlan rebuild(void Function(TradePlanBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TradePlanBuilder toBuilder() => TradePlanBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TradePlan &&
        preferredSide == other.preferredSide &&
        buy == other.buy &&
        sell == other.sell;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, preferredSide.hashCode);
    _$hash = $jc(_$hash, buy.hashCode);
    _$hash = $jc(_$hash, sell.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TradePlan')
          ..add('preferredSide', preferredSide)
          ..add('buy', buy)
          ..add('sell', sell))
        .toString();
  }
}

class TradePlanBuilder implements Builder<TradePlan, TradePlanBuilder> {
  _$TradePlan? _$v;

  TradePlanPreferredSideEnum? _preferredSide;
  TradePlanPreferredSideEnum? get preferredSide => _$this._preferredSide;
  set preferredSide(TradePlanPreferredSideEnum? preferredSide) =>
      _$this._preferredSide = preferredSide;

  TradeSideBuilder? _buy;
  TradeSideBuilder get buy => _$this._buy ??= TradeSideBuilder();
  set buy(TradeSideBuilder? buy) => _$this._buy = buy;

  TradeSideBuilder? _sell;
  TradeSideBuilder get sell => _$this._sell ??= TradeSideBuilder();
  set sell(TradeSideBuilder? sell) => _$this._sell = sell;

  TradePlanBuilder() {
    TradePlan._defaults(this);
  }

  TradePlanBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _preferredSide = $v.preferredSide;
      _buy = $v.buy.toBuilder();
      _sell = $v.sell.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TradePlan other) {
    _$v = other as _$TradePlan;
  }

  @override
  void update(void Function(TradePlanBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TradePlan build() => _build();

  _$TradePlan _build() {
    _$TradePlan _$result;
    try {
      _$result = _$v ??
          _$TradePlan._(
            preferredSide: BuiltValueNullFieldError.checkNotNull(
                preferredSide, r'TradePlan', 'preferredSide'),
            buy: buy.build(),
            sell: sell.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'buy';
        buy.build();
        _$failedField = 'sell';
        sell.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TradePlan', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
