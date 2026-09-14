//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'google_reauth_body.g.dart';

/// GoogleReauthBody
///
/// Properties:
/// * [idToken] - A FRESH Google ID token for the same account. Never logged.
@BuiltValue()
abstract class GoogleReauthBody implements Built<GoogleReauthBody, GoogleReauthBodyBuilder> {
  /// A FRESH Google ID token for the same account. Never logged.
  @BuiltValueField(wireName: r'idToken')
  String get idToken;

  GoogleReauthBody._();

  factory GoogleReauthBody([void updates(GoogleReauthBodyBuilder b)]) = _$GoogleReauthBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(GoogleReauthBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<GoogleReauthBody> get serializer => _$GoogleReauthBodySerializer();
}

class _$GoogleReauthBodySerializer implements PrimitiveSerializer<GoogleReauthBody> {
  @override
  final Iterable<Type> types = const [GoogleReauthBody, _$GoogleReauthBody];

  @override
  final String wireName = r'GoogleReauthBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    GoogleReauthBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'idToken';
    yield serializers.serialize(
      object.idToken,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    GoogleReauthBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required GoogleReauthBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'idToken':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.idToken = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  GoogleReauthBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = GoogleReauthBodyBuilder();
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

