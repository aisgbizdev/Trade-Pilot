//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'google_native_login_body.g.dart';

/// GoogleNativeLoginBody
///
/// Properties:
/// * [idToken] - Google ID token from the device's native Google SDK. Never logged.
@BuiltValue()
abstract class GoogleNativeLoginBody implements Built<GoogleNativeLoginBody, GoogleNativeLoginBodyBuilder> {
  /// Google ID token from the device's native Google SDK. Never logged.
  @BuiltValueField(wireName: r'idToken')
  String get idToken;

  GoogleNativeLoginBody._();

  factory GoogleNativeLoginBody([void updates(GoogleNativeLoginBodyBuilder b)]) = _$GoogleNativeLoginBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(GoogleNativeLoginBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<GoogleNativeLoginBody> get serializer => _$GoogleNativeLoginBodySerializer();
}

class _$GoogleNativeLoginBodySerializer implements PrimitiveSerializer<GoogleNativeLoginBody> {
  @override
  final Iterable<Type> types = const [GoogleNativeLoginBody, _$GoogleNativeLoginBody];

  @override
  final String wireName = r'GoogleNativeLoginBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    GoogleNativeLoginBody object, {
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
    GoogleNativeLoginBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required GoogleNativeLoginBodyBuilder result,
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
  GoogleNativeLoginBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = GoogleNativeLoginBodyBuilder();
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

