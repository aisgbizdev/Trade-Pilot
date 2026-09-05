//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/json_object.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'record_guardrail_telemetry_request.g.dart';

/// RecordGuardrailTelemetryRequest
///
/// Properties:
/// * [kind]
/// * [instrument]
/// * [proceeded]
/// * [metadata]
@BuiltValue()
abstract class RecordGuardrailTelemetryRequest implements Built<RecordGuardrailTelemetryRequest, RecordGuardrailTelemetryRequestBuilder> {
  @BuiltValueField(wireName: r'kind')
  String get kind;

  @BuiltValueField(wireName: r'instrument')
  String? get instrument;

  @BuiltValueField(wireName: r'proceeded')
  bool? get proceeded;

  @BuiltValueField(wireName: r'metadata')
  BuiltMap<String, JsonObject?>? get metadata;

  RecordGuardrailTelemetryRequest._();

  factory RecordGuardrailTelemetryRequest([void updates(RecordGuardrailTelemetryRequestBuilder b)]) = _$RecordGuardrailTelemetryRequest;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(RecordGuardrailTelemetryRequestBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<RecordGuardrailTelemetryRequest> get serializer => _$RecordGuardrailTelemetryRequestSerializer();
}

class _$RecordGuardrailTelemetryRequestSerializer implements PrimitiveSerializer<RecordGuardrailTelemetryRequest> {
  @override
  final Iterable<Type> types = const [RecordGuardrailTelemetryRequest, _$RecordGuardrailTelemetryRequest];

  @override
  final String wireName = r'RecordGuardrailTelemetryRequest';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    RecordGuardrailTelemetryRequest object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'kind';
    yield serializers.serialize(
      object.kind,
      specifiedType: const FullType(String),
    );
    if (object.instrument != null) {
      yield r'instrument';
      yield serializers.serialize(
        object.instrument,
        specifiedType: const FullType(String),
      );
    }
    if (object.proceeded != null) {
      yield r'proceeded';
      yield serializers.serialize(
        object.proceeded,
        specifiedType: const FullType(bool),
      );
    }
    if (object.metadata != null) {
      yield r'metadata';
      yield serializers.serialize(
        object.metadata,
        specifiedType: const FullType(BuiltMap, [FullType(String), FullType.nullable(JsonObject)]),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    RecordGuardrailTelemetryRequest object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required RecordGuardrailTelemetryRequestBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'kind':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.kind = valueDes;
          break;
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.instrument = valueDes;
          break;
        case r'proceeded':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(bool),
          ) as bool?;
          if (valueDes == null) continue;
          result.proceeded = valueDes;
          break;
        case r'metadata':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltMap, [FullType(String), FullType.nullable(JsonObject)]),
          ) as BuiltMap<String, JsonObject?>?;
          if (valueDes == null) continue;
          result.metadata.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  RecordGuardrailTelemetryRequest deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = RecordGuardrailTelemetryRequestBuilder();
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

