//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'add_user_tag_body.g.dart';

/// AddUserTagBody
///
/// Properties:
/// * [tag] 
@BuiltValue()
abstract class AddUserTagBody implements Built<AddUserTagBody, AddUserTagBodyBuilder> {
  @BuiltValueField(wireName: r'tag')
  String get tag;

  AddUserTagBody._();

  factory AddUserTagBody([void updates(AddUserTagBodyBuilder b)]) = _$AddUserTagBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AddUserTagBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AddUserTagBody> get serializer => _$AddUserTagBodySerializer();
}

class _$AddUserTagBodySerializer implements PrimitiveSerializer<AddUserTagBody> {
  @override
  final Iterable<Type> types = const [AddUserTagBody, _$AddUserTagBody];

  @override
  final String wireName = r'AddUserTagBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AddUserTagBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'tag';
    yield serializers.serialize(
      object.tag,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AddUserTagBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AddUserTagBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'tag':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.tag = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AddUserTagBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AddUserTagBodyBuilder();
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

