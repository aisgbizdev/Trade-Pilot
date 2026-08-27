//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'analytics_token_stats_by_instrument_inner.g.dart';

/// AnalyticsTokenStatsByInstrumentInner
///
/// Properties:
/// * [instrument] 
/// * [totalTokens] 
/// * [estimatedCostUsd] 
@BuiltValue()
abstract class AnalyticsTokenStatsByInstrumentInner implements Built<AnalyticsTokenStatsByInstrumentInner, AnalyticsTokenStatsByInstrumentInnerBuilder> {
  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'totalTokens')
  int get totalTokens;

  @BuiltValueField(wireName: r'estimatedCostUsd')
  num get estimatedCostUsd;

  AnalyticsTokenStatsByInstrumentInner._();

  factory AnalyticsTokenStatsByInstrumentInner([void updates(AnalyticsTokenStatsByInstrumentInnerBuilder b)]) = _$AnalyticsTokenStatsByInstrumentInner;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AnalyticsTokenStatsByInstrumentInnerBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AnalyticsTokenStatsByInstrumentInner> get serializer => _$AnalyticsTokenStatsByInstrumentInnerSerializer();
}

class _$AnalyticsTokenStatsByInstrumentInnerSerializer implements PrimitiveSerializer<AnalyticsTokenStatsByInstrumentInner> {
  @override
  final Iterable<Type> types = const [AnalyticsTokenStatsByInstrumentInner, _$AnalyticsTokenStatsByInstrumentInner];

  @override
  final String wireName = r'AnalyticsTokenStatsByInstrumentInner';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AnalyticsTokenStatsByInstrumentInner object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
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
    AnalyticsTokenStatsByInstrumentInner object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AnalyticsTokenStatsByInstrumentInnerBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
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
  AnalyticsTokenStatsByInstrumentInner deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AnalyticsTokenStatsByInstrumentInnerBuilder();
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

