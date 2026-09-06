//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_usage_stats_browser_breakdown_inner.g.dart';

/// AnalyticsUsageStatsBrowserBreakdownInner
///
/// Properties:
/// * [browser] 
/// * [count] 
@BuiltValue()
abstract class AnalyticsUsageStatsBrowserBreakdownInner implements Built<AnalyticsUsageStatsBrowserBreakdownInner, AnalyticsUsageStatsBrowserBreakdownInnerBuilder> {
  @BuiltValueField(wireName: r'browser')
  String get browser;

  @BuiltValueField(wireName: r'count')
  int get count;

  AnalyticsUsageStatsBrowserBreakdownInner._();

  factory AnalyticsUsageStatsBrowserBreakdownInner([void updates(AnalyticsUsageStatsBrowserBreakdownInnerBuilder b)]) = _$AnalyticsUsageStatsBrowserBreakdownInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsUsageStatsBrowserBreakdownInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsUsageStatsBrowserBreakdownInner> get serializer => _$AnalyticsUsageStatsBrowserBreakdownInnerSerializer();
}

class _$AnalyticsUsageStatsBrowserBreakdownInnerSerializer implements PrimitiveSerializer<AnalyticsUsageStatsBrowserBreakdownInner> {
  @override
  final Iterable<Type> types = const [AnalyticsUsageStatsBrowserBreakdownInner, _$AnalyticsUsageStatsBrowserBreakdownInner];

  @override
  final String wireName = r'AnalyticsUsageStatsBrowserBreakdownInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsUsageStatsBrowserBreakdownInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'browser';
    yield serializers.serialize(
      object.browser,
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
    AnalyticsUsageStatsBrowserBreakdownInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsUsageStatsBrowserBreakdownInnerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'browser':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.browser = valueDes;
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
  AnalyticsUsageStatsBrowserBreakdownInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsUsageStatsBrowserBreakdownInnerBuilder();
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

