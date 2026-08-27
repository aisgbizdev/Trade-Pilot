//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/standard_trading_rule_instrument_trading_hours.dart';
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'standard_trading_rule_instrument.g.dart';

/// StandardTradingRuleInstrument
///
/// Properties:
/// * [code] 
/// * [product] 
/// * [contractSize] 
/// * [contractUnit] 
/// * [tradingDays] 
/// * [tradingHours] 
/// * [initialMarginUsdPerLot] 
/// * [facilityFeeUsdPerLotPerSide] 
/// * [vatPercent] 
/// * [rolloverUsdPerLotPerNight] 
/// * [priceSource] 
/// * [priceGuidance] 
/// * [minimumSpread] 
/// * [maximumSpread] 
/// * [hecticSpread] 
/// * [minimumPriceMovement] 
/// * [limitStopRange] 
/// * [deliveryBy] 
@BuiltValue()
abstract class StandardTradingRuleInstrument implements Built<StandardTradingRuleInstrument, StandardTradingRuleInstrumentBuilder> {
  @BuiltValueField(wireName: r'code')
  StandardTradingRuleInstrumentCodeEnum get code;
  // enum codeEnum {  XUL10,  BCO10_BBJ,  };

  @BuiltValueField(wireName: r'product')
  String get product;

  @BuiltValueField(wireName: r'contractSize')
  num get contractSize;

  @BuiltValueField(wireName: r'contractUnit')
  StandardTradingRuleInstrumentContractUnitEnum get contractUnit;
  // enum contractUnitEnum {  troy ounce,  barrel,  };

  @BuiltValueField(wireName: r'tradingDays')
  String get tradingDays;

  @BuiltValueField(wireName: r'tradingHours')
  StandardTradingRuleInstrumentTradingHours get tradingHours;

  @BuiltValueField(wireName: r'initialMarginUsdPerLot')
  num get initialMarginUsdPerLot;

  @BuiltValueField(wireName: r'facilityFeeUsdPerLotPerSide')
  num get facilityFeeUsdPerLotPerSide;

  @BuiltValueField(wireName: r'vatPercent')
  num get vatPercent;

  @BuiltValueField(wireName: r'rolloverUsdPerLotPerNight')
  num get rolloverUsdPerLotPerNight;

  @BuiltValueField(wireName: r'priceSource')
  String get priceSource;

  @BuiltValueField(wireName: r'priceGuidance')
  String get priceGuidance;

  @BuiltValueField(wireName: r'minimumSpread')
  String get minimumSpread;

  @BuiltValueField(wireName: r'maximumSpread')
  String get maximumSpread;

  @BuiltValueField(wireName: r'hecticSpread')
  String get hecticSpread;

  @BuiltValueField(wireName: r'minimumPriceMovement')
  String get minimumPriceMovement;

  @BuiltValueField(wireName: r'limitStopRange')
  String get limitStopRange;

  @BuiltValueField(wireName: r'deliveryBy')
  String get deliveryBy;

  StandardTradingRuleInstrument._();

  factory StandardTradingRuleInstrument([void updates(StandardTradingRuleInstrumentBuilder b)]) = _$StandardTradingRuleInstrument;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(StandardTradingRuleInstrumentBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<StandardTradingRuleInstrument> get serializer => _$StandardTradingRuleInstrumentSerializer();
}

class _$StandardTradingRuleInstrumentSerializer implements PrimitiveSerializer<StandardTradingRuleInstrument> {
  @override
  final Iterable<Type> types = const [StandardTradingRuleInstrument, _$StandardTradingRuleInstrument];

  @override
  final String wireName = r'StandardTradingRuleInstrument';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    StandardTradingRuleInstrument object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'code';
    yield serializers.serialize(
      object.code,
      specifiedType: const FullType(StandardTradingRuleInstrumentCodeEnum),
    );
    yield r'product';
    yield serializers.serialize(
      object.product,
      specifiedType: const FullType(String),
    );
    yield r'contractSize';
    yield serializers.serialize(
      object.contractSize,
      specifiedType: const FullType(num),
    );
    yield r'contractUnit';
    yield serializers.serialize(
      object.contractUnit,
      specifiedType: const FullType(StandardTradingRuleInstrumentContractUnitEnum),
    );
    yield r'tradingDays';
    yield serializers.serialize(
      object.tradingDays,
      specifiedType: const FullType(String),
    );
    yield r'tradingHours';
    yield serializers.serialize(
      object.tradingHours,
      specifiedType: const FullType(StandardTradingRuleInstrumentTradingHours),
    );
    yield r'initialMarginUsdPerLot';
    yield serializers.serialize(
      object.initialMarginUsdPerLot,
      specifiedType: const FullType(num),
    );
    yield r'facilityFeeUsdPerLotPerSide';
    yield serializers.serialize(
      object.facilityFeeUsdPerLotPerSide,
      specifiedType: const FullType(num),
    );
    yield r'vatPercent';
    yield serializers.serialize(
      object.vatPercent,
      specifiedType: const FullType(num),
    );
    yield r'rolloverUsdPerLotPerNight';
    yield serializers.serialize(
      object.rolloverUsdPerLotPerNight,
      specifiedType: const FullType(num),
    );
    yield r'priceSource';
    yield serializers.serialize(
      object.priceSource,
      specifiedType: const FullType(String),
    );
    yield r'priceGuidance';
    yield serializers.serialize(
      object.priceGuidance,
      specifiedType: const FullType(String),
    );
    yield r'minimumSpread';
    yield serializers.serialize(
      object.minimumSpread,
      specifiedType: const FullType(String),
    );
    yield r'maximumSpread';
    yield serializers.serialize(
      object.maximumSpread,
      specifiedType: const FullType(String),
    );
    yield r'hecticSpread';
    yield serializers.serialize(
      object.hecticSpread,
      specifiedType: const FullType(String),
    );
    yield r'minimumPriceMovement';
    yield serializers.serialize(
      object.minimumPriceMovement,
      specifiedType: const FullType(String),
    );
    yield r'limitStopRange';
    yield serializers.serialize(
      object.limitStopRange,
      specifiedType: const FullType(String),
    );
    yield r'deliveryBy';
    yield serializers.serialize(
      object.deliveryBy,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    StandardTradingRuleInstrument object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required StandardTradingRuleInstrumentBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'code':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(StandardTradingRuleInstrumentCodeEnum),
          ) as StandardTradingRuleInstrumentCodeEnum;
          result.code = valueDes;
          break;
        case r'product':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.product = valueDes;
          break;
        case r'contractSize':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.contractSize = valueDes;
          break;
        case r'contractUnit':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(StandardTradingRuleInstrumentContractUnitEnum),
          ) as StandardTradingRuleInstrumentContractUnitEnum;
          result.contractUnit = valueDes;
          break;
        case r'tradingDays':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.tradingDays = valueDes;
          break;
        case r'tradingHours':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(StandardTradingRuleInstrumentTradingHours),
          ) as StandardTradingRuleInstrumentTradingHours;
          result.tradingHours.replace(valueDes);
          break;
        case r'initialMarginUsdPerLot':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.initialMarginUsdPerLot = valueDes;
          break;
        case r'facilityFeeUsdPerLotPerSide':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.facilityFeeUsdPerLotPerSide = valueDes;
          break;
        case r'vatPercent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.vatPercent = valueDes;
          break;
        case r'rolloverUsdPerLotPerNight':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.rolloverUsdPerLotPerNight = valueDes;
          break;
        case r'priceSource':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.priceSource = valueDes;
          break;
        case r'priceGuidance':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.priceGuidance = valueDes;
          break;
        case r'minimumSpread':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.minimumSpread = valueDes;
          break;
        case r'maximumSpread':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.maximumSpread = valueDes;
          break;
        case r'hecticSpread':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.hecticSpread = valueDes;
          break;
        case r'minimumPriceMovement':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.minimumPriceMovement = valueDes;
          break;
        case r'limitStopRange':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.limitStopRange = valueDes;
          break;
        case r'deliveryBy':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.deliveryBy = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  StandardTradingRuleInstrument deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = StandardTradingRuleInstrumentBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

class StandardTradingRuleInstrumentCodeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'XUL10')
  static const StandardTradingRuleInstrumentCodeEnum XUL10 = _$standardTradingRuleInstrumentCodeEnum_XUL10;
  @BuiltValueEnumConst(wireName: r'BCO10_BBJ')
  static const StandardTradingRuleInstrumentCodeEnum BCO10_BBJ = _$standardTradingRuleInstrumentCodeEnum_BCO10_BBJ;

  static Serializer<StandardTradingRuleInstrumentCodeEnum> get serializer => _$standardTradingRuleInstrumentCodeEnumSerializer;

  const StandardTradingRuleInstrumentCodeEnum._(String name): super(name);

  static BuiltSet<StandardTradingRuleInstrumentCodeEnum> get values => _$standardTradingRuleInstrumentCodeEnumValues;
  static StandardTradingRuleInstrumentCodeEnum valueOf(String name) => _$standardTradingRuleInstrumentCodeEnumValueOf(name);
}

class StandardTradingRuleInstrumentContractUnitEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'troy ounce')
  static const StandardTradingRuleInstrumentContractUnitEnum troyOunce = _$standardTradingRuleInstrumentContractUnitEnum_troyOunce;
  @BuiltValueEnumConst(wireName: r'barrel')
  static const StandardTradingRuleInstrumentContractUnitEnum barrel = _$standardTradingRuleInstrumentContractUnitEnum_barrel;

  static Serializer<StandardTradingRuleInstrumentContractUnitEnum> get serializer => _$standardTradingRuleInstrumentContractUnitEnumSerializer;

  const StandardTradingRuleInstrumentContractUnitEnum._(String name): super(name);

  static BuiltSet<StandardTradingRuleInstrumentContractUnitEnum> get values => _$standardTradingRuleInstrumentContractUnitEnumValues;
  static StandardTradingRuleInstrumentContractUnitEnum valueOf(String name) => _$standardTradingRuleInstrumentContractUnitEnumValueOf(name);
}

