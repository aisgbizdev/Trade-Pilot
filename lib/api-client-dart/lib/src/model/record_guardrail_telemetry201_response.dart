//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'record_guardrail_telemetry201_response.g.dart';

/// RecordGuardrailTelemetry201Response
///
/// Properties:
/// * [ok]
/// * [id]
@BuiltValue()
abstract class RecordGuardrailTelemetry201Response implements Built<RecordGuardrailTelemetry201Response, RecordGuardrailTelemetry201ResponseBuilder> {
  @BuiltValueField(wireName: r'ok')
  bool get ok;

  @BuiltValueField(wireName: r'id')
  int get id;

  RecordGuardrailTelemetry201Response._();

  factory RecordGuardrailTelemetry201Response([void updates(RecordGuardrailTelemetry201ResponseBuilder b)]) = _$RecordGuardrailTelemetry201Response;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(RecordGuardrailTelemetry201ResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<RecordGuardrailTelemetry201Response> get serializer => _$RecordGuardrailTelemetry201ResponseSerializer();
}

class _$RecordGuardrailTelemetry201ResponseSerializer implements PrimitiveSerializer<RecordGuardrailTelemetry201Response> {
  @override
  final Iterable<Type> types = const [RecordGuardrailTelemetry201Response, _$RecordGuardrailTelemetry201Response];

  @override
  final String wireName = r'RecordGuardrailTelemetry201Response';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    RecordGuardrailTelemetry201Response object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'ok';
    yield serializers.serialize(
      object.ok,
      specifiedType: const FullType(bool),
    );
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    RecordGuardrailTelemetry201Response object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required RecordGuardrailTelemetry201ResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'ok':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(bool),
          ) as bool;
          result.ok = valueDes;
          break;
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.id = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  RecordGuardrailTelemetry201Response deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = RecordGuardrailTelemetry201ResponseBuilder();
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

