//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_token_stats_by_model_inner.g.dart';

/// AnalyticsTokenStatsByModelInner
///
/// Properties:
/// * [model] 
/// * [totalTokens] 
/// * [estimatedCostUsd] 
/// * [callCount] 
@BuiltValue()
abstract class AnalyticsTokenStatsByModelInner implements Built<AnalyticsTokenStatsByModelInner, AnalyticsTokenStatsByModelInnerBuilder> {
  @BuiltValueField(wireName: r'model')
  String get model;

  @BuiltValueField(wireName: r'totalTokens')
  int get totalTokens;

  @BuiltValueField(wireName: r'estimatedCostUsd')
  num get estimatedCostUsd;

  @BuiltValueField(wireName: r'callCount')
  int get callCount;

  AnalyticsTokenStatsByModelInner._();

  factory AnalyticsTokenStatsByModelInner([void updates(AnalyticsTokenStatsByModelInnerBuilder b)]) = _$AnalyticsTokenStatsByModelInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsTokenStatsByModelInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsTokenStatsByModelInner> get serializer => _$AnalyticsTokenStatsByModelInnerSerializer();
}

class _$AnalyticsTokenStatsByModelInnerSerializer implements PrimitiveSerializer<AnalyticsTokenStatsByModelInner> {
  @override
  final Iterable<Type> types = const [AnalyticsTokenStatsByModelInner, _$AnalyticsTokenStatsByModelInner];

  @override
  final String wireName = r'AnalyticsTokenStatsByModelInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsTokenStatsByModelInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'model';
    yield serializers.serialize(
      object.model,
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
    yield r'callCount';
    yield serializers.serialize(
      object.callCount,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalyticsTokenStatsByModelInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsTokenStatsByModelInnerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'model':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.model = valueDes;
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
        case r'callCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.callCount = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalyticsTokenStatsByModelInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsTokenStatsByModelInnerBuilder();
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

