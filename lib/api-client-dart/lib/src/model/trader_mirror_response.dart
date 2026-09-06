//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/trader_mirror_highlight.dart';
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/trader_mirror_insights.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'trader_mirror_response.g.dart';

/// TraderMirrorResponse
///
/// Properties:
/// * [insights] 
/// * [highlights] 
/// * [timezone] 
@BuiltValue()
abstract class TraderMirrorResponse implements Built<TraderMirrorResponse, TraderMirrorResponseBuilder> {
  @BuiltValueField(wireName: r'insights')
  TraderMirrorInsights get insights;

  @BuiltValueField(wireName: r'highlights')
  BuiltList<TraderMirrorHighlight> get highlights;

  @BuiltValueField(wireName: r'timezone')
  String get timezone;

  TraderMirrorResponse._();

  factory TraderMirrorResponse([void updates(TraderMirrorResponseBuilder b)]) = _$TraderMirrorResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TraderMirrorResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TraderMirrorResponse> get serializer => _$TraderMirrorResponseSerializer();
}

class _$TraderMirrorResponseSerializer implements PrimitiveSerializer<TraderMirrorResponse> {
  @override
  final Iterable<Type> types = const [TraderMirrorResponse, _$TraderMirrorResponse];

  @override
  final String wireName = r'TraderMirrorResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TraderMirrorResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'insights';
    yield serializers.serialize(
      object.insights,
      specifiedType: const FullType(TraderMirrorInsights),
    );
    yield r'highlights';
    yield serializers.serialize(
      object.highlights,
      specifiedType: const FullType(BuiltList, [FullType(TraderMirrorHighlight)]),
    );
    yield r'timezone';
    yield serializers.serialize(
      object.timezone,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TraderMirrorResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TraderMirrorResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'insights':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(TraderMirrorInsights),
          ) as TraderMirrorInsights;
          result.insights.replace(valueDes);
          break;
        case r'highlights':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(TraderMirrorHighlight)]),
          ) as BuiltList<TraderMirrorHighlight>;
          result.highlights.replace(valueDes);
          break;
        case r'timezone':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.timezone = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TraderMirrorResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TraderMirrorResponseBuilder();
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

