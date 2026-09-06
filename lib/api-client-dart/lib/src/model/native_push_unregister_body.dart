//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'native_push_unregister_body.g.dart';

/// NativePushUnregisterBody
///
/// Properties:
/// * [token] 
@BuiltValue()
abstract class NativePushUnregisterBody implements Built<NativePushUnregisterBody, NativePushUnregisterBodyBuilder> {
  @BuiltValueField(wireName: r'token')
  String get token;

  NativePushUnregisterBody._();

  factory NativePushUnregisterBody([void updates(NativePushUnregisterBodyBuilder b)]) = _$NativePushUnregisterBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(NativePushUnregisterBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<NativePushUnregisterBody> get serializer => _$NativePushUnregisterBodySerializer();
}

class _$NativePushUnregisterBodySerializer implements PrimitiveSerializer<NativePushUnregisterBody> {
  @override
  final Iterable<Type> types = const [NativePushUnregisterBody, _$NativePushUnregisterBody];

  @override
  final String wireName = r'NativePushUnregisterBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    NativePushUnregisterBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'token';
    yield serializers.serialize(
      object.token,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    NativePushUnregisterBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required NativePushUnregisterBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'token':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.token = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  NativePushUnregisterBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = NativePushUnregisterBodyBuilder();
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

