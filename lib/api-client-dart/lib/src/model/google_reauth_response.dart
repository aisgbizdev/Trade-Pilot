//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'google_reauth_response.g.dart';

/// GoogleReauthResponse
///
/// Properties:
/// * [reauthToken] - Short-lived, single-use token for one sensitive operation.
/// * [expiresAt] 
@BuiltValue()
abstract class GoogleReauthResponse implements Built<GoogleReauthResponse, GoogleReauthResponseBuilder> {
  /// Short-lived, single-use token for one sensitive operation.
  @BuiltValueField(wireName: r'reauthToken')
  String get reauthToken;

  @BuiltValueField(wireName: r'expiresAt')
  DateTime get expiresAt;

  GoogleReauthResponse._();

  factory GoogleReauthResponse([void updates(GoogleReauthResponseBuilder b)]) = _$GoogleReauthResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(GoogleReauthResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<GoogleReauthResponse> get serializer => _$GoogleReauthResponseSerializer();
}

class _$GoogleReauthResponseSerializer implements PrimitiveSerializer<GoogleReauthResponse> {
  @override
  final Iterable<Type> types = const [GoogleReauthResponse, _$GoogleReauthResponse];

  @override
  final String wireName = r'GoogleReauthResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    GoogleReauthResponse object, {
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
    GoogleReauthResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required GoogleReauthResponseBuilder result,
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
  GoogleReauthResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = GoogleReauthResponseBuilder();
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

