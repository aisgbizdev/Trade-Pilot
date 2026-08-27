//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'standard_trading_rule_account.g.dart';

/// StandardTradingRuleAccount
///
/// Properties:
/// * [minimumDepositUsd] 
/// * [minimumLot] 
/// * [maximumLot] 
/// * [maintenanceMarginPercent] 
/// * [marginCallBelowPercent] 
/// * [marginCallRestorePercent] 
/// * [autoLiquidationAtOrBelowPercent] 
/// * [equityReviewThresholdUsd] 
/// * [equityReviewThresholdIdr] 
@BuiltValue()
abstract class StandardTradingRuleAccount implements Built<StandardTradingRuleAccount, StandardTradingRuleAccountBuilder> {
  @BuiltValueField(wireName: r'minimumDepositUsd')
  num get minimumDepositUsd;

  @BuiltValueField(wireName: r'minimumLot')
  num get minimumLot;

  @BuiltValueField(wireName: r'maximumLot')
  num get maximumLot;

  @BuiltValueField(wireName: r'maintenanceMarginPercent')
  num get maintenanceMarginPercent;

  @BuiltValueField(wireName: r'marginCallBelowPercent')
  num get marginCallBelowPercent;

  @BuiltValueField(wireName: r'marginCallRestorePercent')
  num get marginCallRestorePercent;

  @BuiltValueField(wireName: r'autoLiquidationAtOrBelowPercent')
  num get autoLiquidationAtOrBelowPercent;

  @BuiltValueField(wireName: r'equityReviewThresholdUsd')
  num get equityReviewThresholdUsd;

  @BuiltValueField(wireName: r'equityReviewThresholdIdr')
  num get equityReviewThresholdIdr;

  StandardTradingRuleAccount._();

  factory StandardTradingRuleAccount([void updates(StandardTradingRuleAccountBuilder b)]) = _$StandardTradingRuleAccount;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(StandardTradingRuleAccountBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<StandardTradingRuleAccount> get serializer => _$StandardTradingRuleAccountSerializer();
}

class _$StandardTradingRuleAccountSerializer implements PrimitiveSerializer<StandardTradingRuleAccount> {
  @override
  final Iterable<Type> types = const [StandardTradingRuleAccount, _$StandardTradingRuleAccount];

  @override
  final String wireName = r'StandardTradingRuleAccount';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    StandardTradingRuleAccount object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'minimumDepositUsd';
    yield serializers.serialize(
      object.minimumDepositUsd,
      specifiedType: const FullType(num),
    );
    yield r'minimumLot';
    yield serializers.serialize(
      object.minimumLot,
      specifiedType: const FullType(num),
    );
    yield r'maximumLot';
    yield serializers.serialize(
      object.maximumLot,
      specifiedType: const FullType(num),
    );
    yield r'maintenanceMarginPercent';
    yield serializers.serialize(
      object.maintenanceMarginPercent,
      specifiedType: const FullType(num),
    );
    yield r'marginCallBelowPercent';
    yield serializers.serialize(
      object.marginCallBelowPercent,
      specifiedType: const FullType(num),
    );
    yield r'marginCallRestorePercent';
    yield serializers.serialize(
      object.marginCallRestorePercent,
      specifiedType: const FullType(num),
    );
    yield r'autoLiquidationAtOrBelowPercent';
    yield serializers.serialize(
      object.autoLiquidationAtOrBelowPercent,
      specifiedType: const FullType(num),
    );
    yield r'equityReviewThresholdUsd';
    yield serializers.serialize(
      object.equityReviewThresholdUsd,
      specifiedType: const FullType(num),
    );
    yield r'equityReviewThresholdIdr';
    yield serializers.serialize(
      object.equityReviewThresholdIdr,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    StandardTradingRuleAccount object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required StandardTradingRuleAccountBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'minimumDepositUsd':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.minimumDepositUsd = valueDes;
          break;
        case r'minimumLot':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.minimumLot = valueDes;
          break;
        case r'maximumLot':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.maximumLot = valueDes;
          break;
        case r'maintenanceMarginPercent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.maintenanceMarginPercent = valueDes;
          break;
        case r'marginCallBelowPercent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.marginCallBelowPercent = valueDes;
          break;
        case r'marginCallRestorePercent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.marginCallRestorePercent = valueDes;
          break;
        case r'autoLiquidationAtOrBelowPercent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.autoLiquidationAtOrBelowPercent = valueDes;
          break;
        case r'equityReviewThresholdUsd':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.equityReviewThresholdUsd = valueDes;
          break;
        case r'equityReviewThresholdIdr':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.equityReviewThresholdIdr = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  StandardTradingRuleAccount deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = StandardTradingRuleAccountBuilder();
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

