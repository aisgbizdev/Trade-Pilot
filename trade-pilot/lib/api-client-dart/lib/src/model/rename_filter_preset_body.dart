//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'rename_filter_preset_body.g.dart';

/// RenameFilterPresetBody
///
/// Properties:
/// * [name] 
@BuiltValue()
abstract class RenameFilterPresetBody implements Built<RenameFilterPresetBody, RenameFilterPresetBodyBuilder> {
  @BuiltValueField(wireName: r'name')
  String get name;

  RenameFilterPresetBody._();

  factory RenameFilterPresetBody([void updates(RenameFilterPresetBodyBuilder b)]) = _$RenameFilterPresetBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(RenameFilterPresetBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<RenameFilterPresetBody> get serializer => _$RenameFilterPresetBodySerializer();
}

class _$RenameFilterPresetBodySerializer implements PrimitiveSerializer<RenameFilterPresetBody> {
  @override
  final Iterable<Type> types = const [RenameFilterPresetBody, _$RenameFilterPresetBody];

  @override
  final String wireName = r'RenameFilterPresetBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    RenameFilterPresetBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    RenameFilterPresetBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required RenameFilterPresetBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'name':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.name = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  RenameFilterPresetBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = RenameFilterPresetBodyBuilder();
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

