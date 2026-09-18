//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_topup_request_body.g.dart';

/// CreateTopupRequestBody
///
/// Properties:
/// * [amountRupiah] - Must match the amountRupiah of one of the packages from GET /topups/config exactly.
/// * [paymentReferenceNote] 
/// * [proofObjectPath] - Object path of the uploaded transfer-proof image. Required — admin review has no other way to verify a manual transfer.
@BuiltValue()
abstract class CreateTopupRequestBody implements Built<CreateTopupRequestBody, CreateTopupRequestBodyBuilder> {
  /// Must match the amountRupiah of one of the packages from GET /topups/config exactly.
  @BuiltValueField(wireName: r'amountRupiah')
  int get amountRupiah;

  @BuiltValueField(wireName: r'paymentReferenceNote')
  String? get paymentReferenceNote;

  /// Object path of the uploaded transfer-proof image. Required — admin review has no other way to verify a manual transfer.
  @BuiltValueField(wireName: r'proofObjectPath')
  String get proofObjectPath;

  CreateTopupRequestBody._();

  factory CreateTopupRequestBody([void updates(CreateTopupRequestBodyBuilder b)]) = _$CreateTopupRequestBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateTopupRequestBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateTopupRequestBody> get serializer => _$CreateTopupRequestBodySerializer();
}

class _$CreateTopupRequestBodySerializer implements PrimitiveSerializer<CreateTopupRequestBody> {
  @override
  final Iterable<Type> types = const [CreateTopupRequestBody, _$CreateTopupRequestBody];

  @override
  final String wireName = r'CreateTopupRequestBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateTopupRequestBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'amountRupiah';
    yield serializers.serialize(
      object.amountRupiah,
      specifiedType: const FullType(int),
    );
    if (object.paymentReferenceNote != null) {
      yield r'paymentReferenceNote';
      yield serializers.serialize(
        object.paymentReferenceNote,
        specifiedType: const FullType(String),
      );
    }
    yield r'proofObjectPath';
    yield serializers.serialize(
      object.proofObjectPath,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateTopupRequestBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateTopupRequestBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'amountRupiah':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.amountRupiah = valueDes;
          break;
        case r'paymentReferenceNote':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.paymentReferenceNote = valueDes;
          break;
        case r'proofObjectPath':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.proofObjectPath = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateTopupRequestBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateTopupRequestBodyBuilder();
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

