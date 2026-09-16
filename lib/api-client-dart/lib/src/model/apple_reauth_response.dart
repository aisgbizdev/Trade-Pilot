//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'apple_reauth_response.g.dart';

/// AppleReauthResponse
///
/// Properties:
/// * [reauthToken] - Short-lived, single-use token for one sensitive operation.
/// * [expiresAt] 
@BuiltValue()
abstract class AppleReauthResponse implements Built<AppleReauthResponse, AppleReauthResponseBuilder> {
  /// Short-lived, single-use token for one sensitive operation.
  @BuiltValueField(wireName: r'reauthToken')
  String get reauthToken;

  @BuiltValueField(wireName: r'expiresAt')
  DateTime get expiresAt;

  AppleReauthResponse._();

  factory AppleReauthResponse([void updates(AppleReauthResponseBuilder b)]) = _$AppleReauthResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AppleReauthResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AppleReauthResponse> get serializer => _$AppleReauthResponseSerializer();
}

class _$AppleReauthResponseSerializer implements PrimitiveSerializer<AppleReauthResponse> {
  @override
  final Iterable<Type> types = const [AppleReauthResponse, _$AppleReauthResponse];

  @override
  final String wireName = r'AppleReauthResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AppleReauthResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'reauthToken';
    yield serializers.serialize(
      object.reauthToken,
      specifiedType: const FullType(String),
    );
    yield r'expiresAt';
    yield serializers.serialize(
      object.expiresAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AppleReauthResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AppleReauthResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'reauthToken':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.reauthToken = valueDes;
          break;
        case r'expiresAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.expiresAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AppleReauthResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AppleReauthResponseBuilder();
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

