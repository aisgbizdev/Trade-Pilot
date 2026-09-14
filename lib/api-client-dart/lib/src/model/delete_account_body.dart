//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'delete_account_body.g.dart';

/// Exactly one proof is required, matching the account type: a password account sends `currentPassword`; a Google-only account sends a `reauthToken` from POST /auth/reauth/google.
///
/// Properties:
/// * [currentPassword] - Required for password accounts (`user.hasPassword = true`).
/// * [reauthToken] - Required for Google-only accounts. Single-use, ≤5 min.
@BuiltValue()
abstract class DeleteAccountBody implements Built<DeleteAccountBody, DeleteAccountBodyBuilder> {
  /// Required for password accounts (`user.hasPassword = true`).
  @BuiltValueField(wireName: r'currentPassword')
  String? get currentPassword;

  /// Required for Google-only accounts. Single-use, ≤5 min.
  @BuiltValueField(wireName: r'reauthToken')
  String? get reauthToken;

  DeleteAccountBody._();

  factory DeleteAccountBody([void updates(DeleteAccountBodyBuilder b)]) = _$DeleteAccountBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(DeleteAccountBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<DeleteAccountBody> get serializer => _$DeleteAccountBodySerializer();
}

class _$DeleteAccountBodySerializer implements PrimitiveSerializer<DeleteAccountBody> {
  @override
  final Iterable<Type> types = const [DeleteAccountBody, _$DeleteAccountBody];

  @override
  final String wireName = r'DeleteAccountBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    DeleteAccountBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.currentPassword != null) {
      yield r'currentPassword';
      yield serializers.serialize(
        object.currentPassword,
        specifiedType: const FullType(String),
      );
    }
    if (object.reauthToken != null) {
      yield r'reauthToken';
      yield serializers.serialize(
        object.reauthToken,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    DeleteAccountBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required DeleteAccountBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'currentPassword':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.currentPassword = valueDes;
          break;
        case r'reauthToken':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.reauthToken = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  DeleteAccountBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = DeleteAccountBodyBuilder();
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

