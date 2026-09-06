//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'get_guardrails200_response.g.dart';

/// GetGuardrails200Response
///
/// Properties:
/// * [signals] 
/// * [prefs] 
@BuiltValue()
abstract class GetGuardrails200Response implements Built<GetGuardrails200Response, GetGuardrails200ResponseBuilder> {
  @BuiltValueField(wireName: r'signals')
  BuiltList<BuiltMap<String, JsonObject?>>? get signals;

  @BuiltValueField(wireName: r'prefs')
  BuiltMap<String, JsonObject?>? get prefs;

  GetGuardrails200Response._();

  factory GetGuardrails200Response([void updates(GetGuardrails200ResponseBuilder b)]) = _$GetGuardrails200Response;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(GetGuardrails200ResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<GetGuardrails200Response> get serializer => _$GetGuardrails200ResponseSerializer();
}

class _$GetGuardrails200ResponseSerializer implements PrimitiveSerializer<GetGuardrails200Response> {
  @override
  final Iterable<Type> types = const [GetGuardrails200Response, _$GetGuardrails200Response];

  @override
  final String wireName = r'GetGuardrails200Response';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    GetGuardrails200Response object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.signals != null) {
      yield r'signals';
      yield serializers.serialize(
        object.signals,
        specifiedType: const FullType(BuiltList, [FullType(BuiltMap, [FullType(String), FullType.nullable(JsonObject)])]),
      );
    }
    if (object.prefs != null) {
      yield r'prefs';
      yield serializers.serialize(
        object.prefs,
        specifiedType: const FullType(BuiltMap, [FullType(String), FullType.nullable(JsonObject)]),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    GetGuardrails200Response object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required GetGuardrails200ResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'signals':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(BuiltMap, [FullType(String), FullType.nullable(JsonObject)])]),
          ) as BuiltList<BuiltMap<String, JsonObject?>>?;
          if (valueDes == null) continue;
          result.signals.replace(valueDes);
          break;
        case r'prefs':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltMap, [FullType(String), FullType.nullable(JsonObject)]),
          ) as BuiltMap<String, JsonObject?>?;
          if (valueDes == null) continue;
          result.prefs.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  GetGuardrails200Response deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = GetGuardrails200ResponseBuilder();
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

