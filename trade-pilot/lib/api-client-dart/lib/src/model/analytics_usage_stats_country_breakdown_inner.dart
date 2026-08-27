//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_usage_stats_country_breakdown_inner.g.dart';

/// AnalyticsUsageStatsCountryBreakdownInner
///
/// Properties:
/// * [country] 
/// * [count] 
@BuiltValue()
abstract class AnalyticsUsageStatsCountryBreakdownInner implements Built<AnalyticsUsageStatsCountryBreakdownInner, AnalyticsUsageStatsCountryBreakdownInnerBuilder> {
  @BuiltValueField(wireName: r'country')
  String get country;

  @BuiltValueField(wireName: r'count')
  int get count;

  AnalyticsUsageStatsCountryBreakdownInner._();

  factory AnalyticsUsageStatsCountryBreakdownInner([void updates(AnalyticsUsageStatsCountryBreakdownInnerBuilder b)]) = _$AnalyticsUsageStatsCountryBreakdownInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsUsageStatsCountryBreakdownInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsUsageStatsCountryBreakdownInner> get serializer => _$AnalyticsUsageStatsCountryBreakdownInnerSerializer();
}

class _$AnalyticsUsageStatsCountryBreakdownInnerSerializer implements PrimitiveSerializer<AnalyticsUsageStatsCountryBreakdownInner> {
  @override
  final Iterable<Type> types = const [AnalyticsUsageStatsCountryBreakdownInner, _$AnalyticsUsageStatsCountryBreakdownInner];

  @override
  final String wireName = r'AnalyticsUsageStatsCountryBreakdownInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsUsageStatsCountryBreakdownInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'country';
    yield serializers.serialize(
      object.country,
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
    AnalyticsUsageStatsCountryBreakdownInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsUsageStatsCountryBreakdownInnerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'country':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.country = valueDes;
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
  AnalyticsUsageStatsCountryBreakdownInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsUsageStatsCountryBreakdownInnerBuilder();
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

