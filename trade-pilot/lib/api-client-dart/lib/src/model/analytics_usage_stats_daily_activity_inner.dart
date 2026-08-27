//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_usage_stats_daily_activity_inner.g.dart';

/// AnalyticsUsageStatsDailyActivityInner
///
/// Properties:
/// * [date] 
/// * [count] 
@BuiltValue()
abstract class AnalyticsUsageStatsDailyActivityInner implements Built<AnalyticsUsageStatsDailyActivityInner, AnalyticsUsageStatsDailyActivityInnerBuilder> {
  @BuiltValueField(wireName: r'date')
  String get date;

  @BuiltValueField(wireName: r'count')
  int get count;

  AnalyticsUsageStatsDailyActivityInner._();

  factory AnalyticsUsageStatsDailyActivityInner([void updates(AnalyticsUsageStatsDailyActivityInnerBuilder b)]) = _$AnalyticsUsageStatsDailyActivityInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsUsageStatsDailyActivityInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsUsageStatsDailyActivityInner> get serializer => _$AnalyticsUsageStatsDailyActivityInnerSerializer();
}

class _$AnalyticsUsageStatsDailyActivityInnerSerializer implements PrimitiveSerializer<AnalyticsUsageStatsDailyActivityInner> {
  @override
  final Iterable<Type> types = const [AnalyticsUsageStatsDailyActivityInner, _$AnalyticsUsageStatsDailyActivityInner];

  @override
  final String wireName = r'AnalyticsUsageStatsDailyActivityInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsUsageStatsDailyActivityInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'date';
    yield serializers.serialize(
      object.date,
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
    AnalyticsUsageStatsDailyActivityInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsUsageStatsDailyActivityInnerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'date':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.date = valueDes;
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
  AnalyticsUsageStatsDailyActivityInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsUsageStatsDailyActivityInnerBuilder();
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

