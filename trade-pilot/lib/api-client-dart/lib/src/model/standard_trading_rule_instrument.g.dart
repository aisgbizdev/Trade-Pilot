// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'standard_trading_rule_instrument.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const StandardTradingRuleInstrumentCodeEnum
    _$standardTradingRuleInstrumentCodeEnum_XUL10 =
    const StandardTradingRuleInstrumentCodeEnum._('XUL10');
const StandardTradingRuleInstrumentCodeEnum
    _$standardTradingRuleInstrumentCodeEnum_BCO10_BBJ =
    const StandardTradingRuleInstrumentCodeEnum._('BCO10_BBJ');

StandardTradingRuleInstrumentCodeEnum
    _$standardTradingRuleInstrumentCodeEnumValueOf(String name) {
  switch (name) {
    case 'XUL10':
      return _$standardTradingRuleInstrumentCodeEnum_XUL10;
    case 'BCO10_BBJ':
      return _$standardTradingRuleInstrumentCodeEnum_BCO10_BBJ;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<StandardTradingRuleInstrumentCodeEnum>
    _$standardTradingRuleInstrumentCodeEnumValues = BuiltSet<
        StandardTradingRuleInstrumentCodeEnum>(const <StandardTradingRuleInstrumentCodeEnum>[
  _$standardTradingRuleInstrumentCodeEnum_XUL10,
  _$standardTradingRuleInstrumentCodeEnum_BCO10_BBJ,
]);

const StandardTradingRuleInstrumentContractUnitEnum
    _$standardTradingRuleInstrumentContractUnitEnum_troyOunce =
    const StandardTradingRuleInstrumentContractUnitEnum._('troyOunce');
const StandardTradingRuleInstrumentContractUnitEnum
    _$standardTradingRuleInstrumentContractUnitEnum_barrel =
    const StandardTradingRuleInstrumentContractUnitEnum._('barrel');

StandardTradingRuleInstrumentContractUnitEnum
    _$standardTradingRuleInstrumentContractUnitEnumValueOf(String name) {
  switch (name) {
    case 'troyOunce':
      return _$standardTradingRuleInstrumentContractUnitEnum_troyOunce;
    case 'barrel':
      return _$standardTradingRuleInstrumentContractUnitEnum_barrel;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<StandardTradingRuleInstrumentContractUnitEnum>
    _$standardTradingRuleInstrumentContractUnitEnumValues = BuiltSet<
        StandardTradingRuleInstrumentContractUnitEnum>(const <StandardTradingRuleInstrumentContractUnitEnum>[
  _$standardTradingRuleInstrumentContractUnitEnum_troyOunce,
  _$standardTradingRuleInstrumentContractUnitEnum_barrel,
]);

Serializer<StandardTradingRuleInstrumentCodeEnum>
    _$standardTradingRuleInstrumentCodeEnumSerializer =
    _$StandardTradingRuleInstrumentCodeEnumSerializer();
Serializer<StandardTradingRuleInstrumentContractUnitEnum>
    _$standardTradingRuleInstrumentContractUnitEnumSerializer =
    _$StandardTradingRuleInstrumentContractUnitEnumSerializer();

class _$StandardTradingRuleInstrumentCodeEnumSerializer
    implements PrimitiveSerializer<StandardTradingRuleInstrumentCodeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'XUL10': 'XUL10',
    'BCO10_BBJ': 'BCO10_BBJ',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'XUL10': 'XUL10',
    'BCO10_BBJ': 'BCO10_BBJ',
  };

  @override
  final Iterable<Type> types = const <Type>[
    StandardTradingRuleInstrumentCodeEnum
  ];
  @override
  final String wireName = 'StandardTradingRuleInstrumentCodeEnum';

  @override
  Object serialize(
          Serializers serializers, StandardTradingRuleInstrumentCodeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  StandardTradingRuleInstrumentCodeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      StandardTradingRuleInstrumentCodeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$StandardTradingRuleInstrumentContractUnitEnumSerializer
    implements
        PrimitiveSerializer<StandardTradingRuleInstrumentContractUnitEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'troyOunce': 'troy ounce',
    'barrel': 'barrel',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'troy ounce': 'troyOunce',
    'barrel': 'barrel',
  };

  @override
  final Iterable<Type> types = const <Type>[
    StandardTradingRuleInstrumentContractUnitEnum
  ];
  @override
  final String wireName = 'StandardTradingRuleInstrumentContractUnitEnum';

  @override
  Object serialize(Serializers serializers,
          StandardTradingRuleInstrumentContractUnitEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  StandardTradingRuleInstrumentContractUnitEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      StandardTradingRuleInstrumentContractUnitEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$StandardTradingRuleInstrument extends StandardTradingRuleInstrument {
  @override
  final StandardTradingRuleInstrumentCodeEnum code;
  @override
  final String product;
  @override
  final num contractSize;
  @override
  final StandardTradingRuleInstrumentContractUnitEnum contractUnit;
  @override
  final String tradingDays;
  @override
  final StandardTradingRuleInstrumentTradingHours tradingHours;
  @override
  final num initialMarginUsdPerLot;
  @override
  final num facilityFeeUsdPerLotPerSide;
  @override
  final num vatPercent;
  @override
  final num rolloverUsdPerLotPerNight;
  @override
  final String priceSource;
  @override
  final String priceGuidance;
  @override
  final String minimumSpread;
  @override
  final String maximumSpread;
  @override
  final String hecticSpread;
  @override
  final String minimumPriceMovement;
  @override
  final String limitStopRange;
  @override
  final String deliveryBy;

  factory _$StandardTradingRuleInstrument(
          [void Function(StandardTradingRuleInstrumentBuilder)? updates]) =>
      (StandardTradingRuleInstrumentBuilder()..update(updates))._build();

  _$StandardTradingRuleInstrument._(
      {required this.code,
      required this.product,
      required this.contractSize,
      required this.contractUnit,
      required this.tradingDays,
      required this.tradingHours,
      required this.initialMarginUsdPerLot,
      required this.facilityFeeUsdPerLotPerSide,
      required this.vatPercent,
      required this.rolloverUsdPerLotPerNight,
      required this.priceSource,
      required this.priceGuidance,
      required this.minimumSpread,
      required this.maximumSpread,
      required this.hecticSpread,
      required this.minimumPriceMovement,
      required this.limitStopRange,
      required this.deliveryBy})
      : super._();
  @override
  StandardTradingRuleInstrument rebuild(
          void Function(StandardTradingRuleInstrumentBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  StandardTradingRuleInstrumentBuilder toBuilder() =>
      StandardTradingRuleInstrumentBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is StandardTradingRuleInstrument &&
        code == other.code &&
        product == other.product &&
        contractSize == other.contractSize &&
        contractUnit == other.contractUnit &&
        tradingDays == other.tradingDays &&
        tradingHours == other.tradingHours &&
        initialMarginUsdPerLot == other.initialMarginUsdPerLot &&
        facilityFeeUsdPerLotPerSide == other.facilityFeeUsdPerLotPerSide &&
        vatPercent == other.vatPercent &&
        rolloverUsdPerLotPerNight == other.rolloverUsdPerLotPerNight &&
        priceSource == other.priceSource &&
        priceGuidance == other.priceGuidance &&
        minimumSpread == other.minimumSpread &&
        maximumSpread == other.maximumSpread &&
        hecticSpread == other.hecticSpread &&
        minimumPriceMovement == other.minimumPriceMovement &&
        limitStopRange == other.limitStopRange &&
        deliveryBy == other.deliveryBy;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, code.hashCode);
    _$hash = $jc(_$hash, product.hashCode);
    _$hash = $jc(_$hash, contractSize.hashCode);
    _$hash = $jc(_$hash, contractUnit.hashCode);
    _$hash = $jc(_$hash, tradingDays.hashCode);
    _$hash = $jc(_$hash, tradingHours.hashCode);
    _$hash = $jc(_$hash, initialMarginUsdPerLot.hashCode);
    _$hash = $jc(_$hash, facilityFeeUsdPerLotPerSide.hashCode);
    _$hash = $jc(_$hash, vatPercent.hashCode);
    _$hash = $jc(_$hash, rolloverUsdPerLotPerNight.hashCode);
    _$hash = $jc(_$hash, priceSource.hashCode);
    _$hash = $jc(_$hash, priceGuidance.hashCode);
    _$hash = $jc(_$hash, minimumSpread.hashCode);
    _$hash = $jc(_$hash, maximumSpread.hashCode);
    _$hash = $jc(_$hash, hecticSpread.hashCode);
    _$hash = $jc(_$hash, minimumPriceMovement.hashCode);
    _$hash = $jc(_$hash, limitStopRange.hashCode);
    _$hash = $jc(_$hash, deliveryBy.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'StandardTradingRuleInstrument')
          ..add('code', code)
          ..add('product', product)
          ..add('contractSize', contractSize)
          ..add('contractUnit', contractUnit)
          ..add('tradingDays', tradingDays)
          ..add('tradingHours', tradingHours)
          ..add('initialMarginUsdPerLot', initialMarginUsdPerLot)
          ..add('facilityFeeUsdPerLotPerSide', facilityFeeUsdPerLotPerSide)
          ..add('vatPercent', vatPercent)
          ..add('rolloverUsdPerLotPerNight', rolloverUsdPerLotPerNight)
          ..add('priceSource', priceSource)
          ..add('priceGuidance', priceGuidance)
          ..add('minimumSpread', minimumSpread)
          ..add('maximumSpread', maximumSpread)
          ..add('hecticSpread', hecticSpread)
          ..add('minimumPriceMovement', minimumPriceMovement)
          ..add('limitStopRange', limitStopRange)
          ..add('deliveryBy', deliveryBy))
        .toString();
  }
}

class StandardTradingRuleInstrumentBuilder
    implements
        Builder<StandardTradingRuleInstrument,
            StandardTradingRuleInstrumentBuilder> {
  _$StandardTradingRuleInstrument? _$v;

  StandardTradingRuleInstrumentCodeEnum? _code;
  StandardTradingRuleInstrumentCodeEnum? get code => _$this._code;
  set code(StandardTradingRuleInstrumentCodeEnum? code) => _$this._code = code;

  String? _product;
  String? get product => _$this._product;
  set product(String? product) => _$this._product = product;

  num? _contractSize;
  num? get contractSize => _$this._contractSize;
  set contractSize(num? contractSize) => _$this._contractSize = contractSize;

  StandardTradingRuleInstrumentContractUnitEnum? _contractUnit;
  StandardTradingRuleInstrumentContractUnitEnum? get contractUnit =>
      _$this._contractUnit;
  set contractUnit(
          StandardTradingRuleInstrumentContractUnitEnum? contractUnit) =>
      _$this._contractUnit = contractUnit;

  String? _tradingDays;
  String? get tradingDays => _$this._tradingDays;
  set tradingDays(String? tradingDays) => _$this._tradingDays = tradingDays;

  StandardTradingRuleInstrumentTradingHoursBuilder? _tradingHours;
  StandardTradingRuleInstrumentTradingHoursBuilder get tradingHours =>
      _$this._tradingHours ??=
          StandardTradingRuleInstrumentTradingHoursBuilder();
  set tradingHours(
          StandardTradingRuleInstrumentTradingHoursBuilder? tradingHours) =>
      _$this._tradingHours = tradingHours;

  num? _initialMarginUsdPerLot;
  num? get initialMarginUsdPerLot => _$this._initialMarginUsdPerLot;
  set initialMarginUsdPerLot(num? initialMarginUsdPerLot) =>
      _$this._initialMarginUsdPerLot = initialMarginUsdPerLot;

  num? _facilityFeeUsdPerLotPerSide;
  num? get facilityFeeUsdPerLotPerSide => _$this._facilityFeeUsdPerLotPerSide;
  set facilityFeeUsdPerLotPerSide(num? facilityFeeUsdPerLotPerSide) =>
      _$this._facilityFeeUsdPerLotPerSide = facilityFeeUsdPerLotPerSide;

  num? _vatPercent;
  num? get vatPercent => _$this._vatPercent;
  set vatPercent(num? vatPercent) => _$this._vatPercent = vatPercent;

  num? _rolloverUsdPerLotPerNight;
  num? get rolloverUsdPerLotPerNight => _$this._rolloverUsdPerLotPerNight;
  set rolloverUsdPerLotPerNight(num? rolloverUsdPerLotPerNight) =>
      _$this._rolloverUsdPerLotPerNight = rolloverUsdPerLotPerNight;

  String? _priceSource;
  String? get priceSource => _$this._priceSource;
  set priceSource(String? priceSource) => _$this._priceSource = priceSource;

  String? _priceGuidance;
  String? get priceGuidance => _$this._priceGuidance;
  set priceGuidance(String? priceGuidance) =>
      _$this._priceGuidance = priceGuidance;

  String? _minimumSpread;
  String? get minimumSpread => _$this._minimumSpread;
  set minimumSpread(String? minimumSpread) =>
      _$this._minimumSpread = minimumSpread;

  String? _maximumSpread;
  String? get maximumSpread => _$this._maximumSpread;
  set maximumSpread(String? maximumSpread) =>
      _$this._maximumSpread = maximumSpread;

  String? _hecticSpread;
  String? get hecticSpread => _$this._hecticSpread;
  set hecticSpread(String? hecticSpread) => _$this._hecticSpread = hecticSpread;

  String? _minimumPriceMovement;
  String? get minimumPriceMovement => _$this._minimumPriceMovement;
  set minimumPriceMovement(String? minimumPriceMovement) =>
      _$this._minimumPriceMovement = minimumPriceMovement;

  String? _limitStopRange;
  String? get limitStopRange => _$this._limitStopRange;
  set limitStopRange(String? limitStopRange) =>
      _$this._limitStopRange = limitStopRange;

  String? _deliveryBy;
  String? get deliveryBy => _$this._deliveryBy;
  set deliveryBy(String? deliveryBy) => _$this._deliveryBy = deliveryBy;

  StandardTradingRuleInstrumentBuilder() {
    StandardTradingRuleInstrument._defaults(this);
  }

  StandardTradingRuleInstrumentBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _code = $v.code;
      _product = $v.product;
      _contractSize = $v.contractSize;
      _contractUnit = $v.contractUnit;
      _tradingDays = $v.tradingDays;
      _tradingHours = $v.tradingHours.toBuilder();
      _initialMarginUsdPerLot = $v.initialMarginUsdPerLot;
      _facilityFeeUsdPerLotPerSide = $v.facilityFeeUsdPerLotPerSide;
      _vatPercent = $v.vatPercent;
      _rolloverUsdPerLotPerNight = $v.rolloverUsdPerLotPerNight;
      _priceSource = $v.priceSource;
      _priceGuidance = $v.priceGuidance;
      _minimumSpread = $v.minimumSpread;
      _maximumSpread = $v.maximumSpread;
      _hecticSpread = $v.hecticSpread;
      _minimumPriceMovement = $v.minimumPriceMovement;
      _limitStopRange = $v.limitStopRange;
      _deliveryBy = $v.deliveryBy;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(StandardTradingRuleInstrument other) {
    _$v = other as _$StandardTradingRuleInstrument;
  }

  @override
  void update(void Function(StandardTradingRuleInstrumentBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  StandardTradingRuleInstrument build() => _build();

  _$StandardTradingRuleInstrument _build() {
    _$StandardTradingRuleInstrument _$result;
    try {
      _$result = _$v ??
          _$StandardTradingRuleInstrument._(
            code: BuiltValueNullFieldError.checkNotNull(
                code, r'StandardTradingRuleInstrument', 'code'),
            product: BuiltValueNullFieldError.checkNotNull(
                product, r'StandardTradingRuleInstrument', 'product'),
            contractSize: BuiltValueNullFieldError.checkNotNull(
                contractSize, r'StandardTradingRuleInstrument', 'contractSize'),
            contractUnit: BuiltValueNullFieldError.checkNotNull(
                contractUnit, r'StandardTradingRuleInstrument', 'contractUnit'),
            tradingDays: BuiltValueNullFieldError.checkNotNull(
                tradingDays, r'StandardTradingRuleInstrument', 'tradingDays'),
            tradingHours: tradingHours.build(),
            initialMarginUsdPerLot: BuiltValueNullFieldError.checkNotNull(
                initialMarginUsdPerLot,
                r'StandardTradingRuleInstrument',
                'initialMarginUsdPerLot'),
            facilityFeeUsdPerLotPerSide: BuiltValueNullFieldError.checkNotNull(
                facilityFeeUsdPerLotPerSide,
                r'StandardTradingRuleInstrument',
                'facilityFeeUsdPerLotPerSide'),
            vatPercent: BuiltValueNullFieldError.checkNotNull(
                vatPercent, r'StandardTradingRuleInstrument', 'vatPercent'),
            rolloverUsdPerLotPerNight: BuiltValueNullFieldError.checkNotNull(
                rolloverUsdPerLotPerNight,
                r'StandardTradingRuleInstrument',
                'rolloverUsdPerLotPerNight'),
            priceSource: BuiltValueNullFieldError.checkNotNull(
                priceSource, r'StandardTradingRuleInstrument', 'priceSource'),
            priceGuidance: BuiltValueNullFieldError.checkNotNull(priceGuidance,
                r'StandardTradingRuleInstrument', 'priceGuidance'),
            minimumSpread: BuiltValueNullFieldError.checkNotNull(minimumSpread,
                r'StandardTradingRuleInstrument', 'minimumSpread'),
            maximumSpread: BuiltValueNullFieldError.checkNotNull(maximumSpread,
                r'StandardTradingRuleInstrument', 'maximumSpread'),
            hecticSpread: BuiltValueNullFieldError.checkNotNull(
                hecticSpread, r'StandardTradingRuleInstrument', 'hecticSpread'),
            minimumPriceMovement: BuiltValueNullFieldError.checkNotNull(
                minimumPriceMovement,
                r'StandardTradingRuleInstrument',
                'minimumPriceMovement'),
            limitStopRange: BuiltValueNullFieldError.checkNotNull(
                limitStopRange,
                r'StandardTradingRuleInstrument',
                'limitStopRange'),
            deliveryBy: BuiltValueNullFieldError.checkNotNull(
                deliveryBy, r'StandardTradingRuleInstrument', 'deliveryBy'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'tradingHours';
        tradingHours.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'StandardTradingRuleInstrument', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
