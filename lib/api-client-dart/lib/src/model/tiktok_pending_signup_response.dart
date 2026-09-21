//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'tiktok_pending_signup_response.g.dart';

/// TiktokPendingSignupResponse
///
/// Properties:
/// * [displayName] 
/// * [avatarUrl] 
@BuiltValue()
abstract class TiktokPendingSignupResponse implements Built<TiktokPendingSignupResponse, TiktokPendingSignupResponseBuilder> {
  @BuiltValueField(wireName: r'displayName')
  String? get displayName;

  @BuiltValueField(wireName: r'avatarUrl')
  String? get avatarUrl;

  TiktokPendingSignupResponse._();

  factory TiktokPendingSignupResponse([void updates(TiktokPendingSignupResponseBuilder b)]) = _$TiktokPendingSignupResponse;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TiktokPendingSignupResponseBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TiktokPendingSignupResponse> get serializer => _$TiktokPendingSignupResponseSerializer();
}

class _$TiktokPendingSignupResponseSerializer implements PrimitiveSerializer<TiktokPendingSignupResponse> {
  @override
  final Iterable<Type> types = const [TiktokPendingSignupResponse, _$TiktokPendingSignupResponse];

  @override
  final String wireName = r'TiktokPendingSignupResponse';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TiktokPendingSignupResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.displayName != null) {
      yield r'displayName';
      yield serializers.serialize(
        object.displayName,
        specifiedType: const FullType(String),
      );
    }
    if (object.avatarUrl != null) {
      yield r'avatarUrl';
      yield serializers.serialize(
        object.avatarUrl,
        specifiedType: const FullType(String),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    TiktokPendingSignupResponse object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TiktokPendingSignupResponseBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'displayName':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.displayName = valueDes;
          break;
        case r'avatarUrl':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.avatarUrl = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TiktokPendingSignupResponse deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TiktokPendingSignupResponseBuilder();
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

