//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_usage_stats_feature_breakdown_inner.g.dart';

/// AnalyticsUsageStatsFeatureBreakdownInner
///
/// Properties:
/// * [eventType] 
/// * [count] 
@BuiltValue()
abstract class AnalyticsUsageStatsFeatureBreakdownInner implements Built<AnalyticsUsageStatsFeatureBreakdownInner, AnalyticsUsageStatsFeatureBreakdownInnerBuilder> {
  @BuiltValueField(wireName: r'eventType')
  String get eventType;

  @BuiltValueField(wireName: r'count')
  int get count;

  AnalyticsUsageStatsFeatureBreakdownInner._();

  factory AnalyticsUsageStatsFeatureBreakdownInner([void updates(AnalyticsUsageStatsFeatureBreakdownInnerBuilder b)]) = _$AnalyticsUsageStatsFeatureBreakdownInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsUsageStatsFeatureBreakdownInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsUsageStatsFeatureBreakdownInner> get serializer => _$AnalyticsUsageStatsFeatureBreakdownInnerSerializer();
}

class _$AnalyticsUsageStatsFeatureBreakdownInnerSerializer implements PrimitiveSerializer<AnalyticsUsageStatsFeatureBreakdownInner> {
  @override
  final Iterable<Type> types = const [AnalyticsUsageStatsFeatureBreakdownInner, _$AnalyticsUsageStatsFeatureBreakdownInner];

  @override
  final String wireName = r'AnalyticsUsageStatsFeatureBreakdownInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsUsageStatsFeatureBreakdownInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'eventType';
    yield serializers.serialize(
      object.eventType,
      specifiedType: const FullType(String),
    );
    yield r'count';
    yield serializers.serialize(
      object.count,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalyticsUsageStatsFeatureBreakdownInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsUsageStatsFeatureBreakdownInnerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'eventType':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.eventType = valueDes;
          break;
        case r'count':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.count = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalyticsUsageStatsFeatureBreakdownInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsUsageStatsFeatureBreakdownInnerBuilder();
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

