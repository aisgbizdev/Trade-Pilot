//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_token_stats_by_segment_inner.g.dart';

/// AnalyticsTokenStatsBySegmentInner
///
/// Properties:
/// * [segment] 
/// * [totalTokens] 
/// * [estimatedCostUsd] 
/// * [callCount] 
/// * [analysisCount] 
@BuiltValue()
abstract class AnalyticsTokenStatsBySegmentInner implements Built<AnalyticsTokenStatsBySegmentInner, AnalyticsTokenStatsBySegmentInnerBuilder> {
  @BuiltValueField(wireName: r'segment')
  AnalyticsTokenStatsBySegmentInnerSegmentEnum get segment;
  // enum segmentEnum {  free,  paid,  dev,  };

  @BuiltValueField(wireName: r'totalTokens')
  int get totalTokens;

  @BuiltValueField(wireName: r'estimatedCostUsd')
  num get estimatedCostUsd;

  @BuiltValueField(wireName: r'callCount')
  int get callCount;

  @BuiltValueField(wireName: r'analysisCount')
  int get analysisCount;

  AnalyticsTokenStatsBySegmentInner._();

  factory AnalyticsTokenStatsBySegmentInner([void updates(AnalyticsTokenStatsBySegmentInnerBuilder b)]) = _$AnalyticsTokenStatsBySegmentInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsTokenStatsBySegmentInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsTokenStatsBySegmentInner> get serializer => _$AnalyticsTokenStatsBySegmentInnerSerializer();
}

class _$AnalyticsTokenStatsBySegmentInnerSerializer implements PrimitiveSerializer<AnalyticsTokenStatsBySegmentInner> {
  @override
  final Iterable<Type> types = const [AnalyticsTokenStatsBySegmentInner, _$AnalyticsTokenStatsBySegmentInner];

  @override
  final String wireName = r'AnalyticsTokenStatsBySegmentInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsTokenStatsBySegmentInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'segment';
    yield serializers.serialize(
      object.segment,
      specifiedType: const FullType(AnalyticsTokenStatsBySegmentInnerSegmentEnum),
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
    yield r'analysisCount';
    yield serializers.serialize(
      object.analysisCount,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AnalyticsTokenStatsBySegmentInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsTokenStatsBySegmentInnerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'segment':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(AnalyticsTokenStatsBySegmentInnerSegmentEnum),
          ) as AnalyticsTokenStatsBySegmentInnerSegmentEnum;
          result.segment = valueDes;
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
        case r'analysisCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.analysisCount = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AnalyticsTokenStatsBySegmentInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsTokenStatsBySegmentInnerBuilder();
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

class AnalyticsTokenStatsBySegmentInnerSegmentEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'free')
  static const AnalyticsTokenStatsBySegmentInnerSegmentEnum free = _$analyticsTokenStatsBySegmentInnerSegmentEnum_free;
  @BuiltValueEnumConst(wireName: r'paid')
  static const AnalyticsTokenStatsBySegmentInnerSegmentEnum paid = _$analyticsTokenStatsBySegmentInnerSegmentEnum_paid;
  @BuiltValueEnumConst(wireName: r'dev')
  static const AnalyticsTokenStatsBySegmentInnerSegmentEnum dev = _$analyticsTokenStatsBySegmentInnerSegmentEnum_dev;

  static Serializer<AnalyticsTokenStatsBySegmentInnerSegmentEnum> get serializer => _$analyticsTokenStatsBySegmentInnerSegmentEnumSerializer;

  const AnalyticsTokenStatsBySegmentInnerSegmentEnum._(String name): super(name);

  static BuiltSet<AnalyticsTokenStatsBySegmentInnerSegmentEnum> get values => _$analyticsTokenStatsBySegmentInnerSegmentEnumValues;
  static AnalyticsTokenStatsBySegmentInnerSegmentEnum valueOf(String name) => _$analyticsTokenStatsBySegmentInnerSegmentEnumValueOf(name);
}

