//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'native_push_register_body.g.dart';

/// NativePushRegisterBody
///
/// Properties:
/// * [token] 
/// * [platform] 
@BuiltValue()
abstract class NativePushRegisterBody implements Built<NativePushRegisterBody, NativePushRegisterBodyBuilder> {
  @BuiltValueField(wireName: r'token')
  String get token;

  @BuiltValueField(wireName: r'platform')
  NativePushRegisterBodyPlatformEnum get platform;
  // enum platformEnum {  android,  ios,  };

  NativePushRegisterBody._();

  factory NativePushRegisterBody([void updates(NativePushRegisterBodyBuilder b)]) = _$NativePushRegisterBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(NativePushRegisterBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<NativePushRegisterBody> get serializer => _$NativePushRegisterBodySerializer();
}

class _$NativePushRegisterBodySerializer implements PrimitiveSerializer<NativePushRegisterBody> {
  @override
  final Iterable<Type> types = const [NativePushRegisterBody, _$NativePushRegisterBody];

  @override
  final String wireName = r'NativePushRegisterBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    NativePushRegisterBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'token';
    yield serializers.serialize(
      object.token,
      specifiedType: const FullType(String),
    );
    yield r'platform';
    yield serializers.serialize(
      object.platform,
      specifiedType: const FullType(NativePushRegisterBodyPlatformEnum),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    NativePushRegisterBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required NativePushRegisterBodyBuilder result,
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
        case r'platform':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(NativePushRegisterBodyPlatformEnum),
          ) as NativePushRegisterBodyPlatformEnum;
          result.platform = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  NativePushRegisterBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = NativePushRegisterBodyBuilder();
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

class NativePushRegisterBodyPlatformEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'android')
  static const NativePushRegisterBodyPlatformEnum android = _$nativePushRegisterBodyPlatformEnum_android;
  @BuiltValueEnumConst(wireName: r'ios')
  static const NativePushRegisterBodyPlatformEnum ios = _$nativePushRegisterBodyPlatformEnum_ios;

  static Serializer<NativePushRegisterBodyPlatformEnum> get serializer => _$nativePushRegisterBodyPlatformEnumSerializer;

  const NativePushRegisterBodyPlatformEnum._(String name): super(name);

  static BuiltSet<NativePushRegisterBodyPlatformEnum> get values => _$nativePushRegisterBodyPlatformEnumValues;
  static NativePushRegisterBodyPlatformEnum valueOf(String name) => _$nativePushRegisterBodyPlatformEnumValueOf(name);
}

