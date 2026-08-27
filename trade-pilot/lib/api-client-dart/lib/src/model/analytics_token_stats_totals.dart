//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_token_stats_totals.g.dart';

/// AnalyticsTokenStatsTotals
///
/// Properties:
/// * [totalTokens] 
/// * [totalCostUsd] 
/// * [totalCalls] 
@BuiltValue()
abstract class AnalyticsTokenStatsTotals implements Built<AnalyticsTokenStatsTotals, AnalyticsTokenStatsTotalsBuilder> {
  @BuiltValueField(wireName: r'totalTokens')
  int get totalTokens;

  @BuiltValueField(wireName: r'totalCostUsd')
  num get totalCostUsd;

  @BuiltValueField(wireName: r'totalCalls')
  int get totalCalls;

  AnalyticsTokenStatsTotals._();

  factory AnalyticsTokenStatsTotals([void updates(AnalyticsTokenStatsTotalsBuilder b)]) = _$AnalyticsTokenStatsTotals;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsTokenStatsTotalsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsTokenStatsTotals> get serializer => _$AnalyticsTokenStatsTotalsSerializer();
}

class _$AnalyticsTokenStatsTotalsSerializer implements PrimitiveSerializer<AnalyticsTokenStatsTotals> {
  @override
  final Iterable<Type> types = const [AnalyticsTokenStatsTotals, _$AnalyticsTokenStatsTotals];

  @override
  final String wireName = r'AnalyticsTokenStatsTotals';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsTokenStatsTotals object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'totalTokens';
    yield serializers.serialize(
      object.totalTokens,
      specifiedType: const FullType(int),
    );
    yield r'totalCostUsd';
    yield serializers.serialize(
      object.totalCostUsd,
      specifiedType: const FullType(num),
    );
    yield r'totalCalls';
    yield serializers.serialize(
      object.totalCalls,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalyticsTokenStatsTotals object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsTokenStatsTotalsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'totalTokens':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalTokens = valueDes;
          break;
        case r'totalCostUsd':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.totalCostUsd = valueDes;
          break;
        case r'totalCalls':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalCalls = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalyticsTokenStatsTotals deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsTokenStatsTotalsBuilder();
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

