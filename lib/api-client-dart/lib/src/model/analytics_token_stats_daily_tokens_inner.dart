//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_token_stats_daily_tokens_inner.g.dart';

/// AnalyticsTokenStatsDailyTokensInner
///
/// Properties:
/// * [date] 
/// * [totalTokens] 
/// * [estimatedCostUsd] 
@BuiltValue()
abstract class AnalyticsTokenStatsDailyTokensInner implements Built<AnalyticsTokenStatsDailyTokensInner, AnalyticsTokenStatsDailyTokensInnerBuilder> {
  @BuiltValueField(wireName: r'date')
  String get date;

  @BuiltValueField(wireName: r'totalTokens')
  int get totalTokens;

  @BuiltValueField(wireName: r'estimatedCostUsd')
  num get estimatedCostUsd;

  AnalyticsTokenStatsDailyTokensInner._();

  factory AnalyticsTokenStatsDailyTokensInner([void updates(AnalyticsTokenStatsDailyTokensInnerBuilder b)]) = _$AnalyticsTokenStatsDailyTokensInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsTokenStatsDailyTokensInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsTokenStatsDailyTokensInner> get serializer => _$AnalyticsTokenStatsDailyTokensInnerSerializer();
}

class _$AnalyticsTokenStatsDailyTokensInnerSerializer implements PrimitiveSerializer<AnalyticsTokenStatsDailyTokensInner> {
  @override
  final Iterable<Type> types = const [AnalyticsTokenStatsDailyTokensInner, _$AnalyticsTokenStatsDailyTokensInner];

  @override
  final String wireName = r'AnalyticsTokenStatsDailyTokensInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsTokenStatsDailyTokensInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'date';
    yield serializers.serialize(
      object.date,
      specifiedType: const FullType(String),
    );
    yield r'totalTokens';
    yield serializers.serialize(
      object.totalTokens,
      specifiedType: const FullType(int),
    );
    yield r'estimatedCostUsd';
    yield serializers.serialize(
      object.estimatedCostUsd,
      specifiedType: const FullType(num),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalyticsTokenStatsDailyTokensInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsTokenStatsDailyTokensInnerBuilder result,
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
        case r'totalTokens':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.totalTokens = valueDes;
          break;
        case r'estimatedCostUsd':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(num),
          ) as num;
          result.estimatedCostUsd = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalyticsTokenStatsDailyTokensInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsTokenStatsDailyTokensInnerBuilder();
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

