//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/filter_preset_filters.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_filter_preset_body.g.dart';

/// CreateFilterPresetBody
///
/// Properties:
/// * [name] 
/// * [filters] 
@BuiltValue()
abstract class CreateFilterPresetBody implements Built<CreateFilterPresetBody, CreateFilterPresetBodyBuilder> {
  @BuiltValueField(wireName: r'name')
  String get name;

  @BuiltValueField(wireName: r'filters')
  FilterPresetFilters get filters;

  CreateFilterPresetBody._();

  factory CreateFilterPresetBody([void updates(CreateFilterPresetBodyBuilder b)]) = _$CreateFilterPresetBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateFilterPresetBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateFilterPresetBody> get serializer => _$CreateFilterPresetBodySerializer();
}

class _$CreateFilterPresetBodySerializer implements PrimitiveSerializer<CreateFilterPresetBody> {
  @override
  final Iterable<Type> types = const [CreateFilterPresetBody, _$CreateFilterPresetBody];

  @override
  final String wireName = r'CreateFilterPresetBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateFilterPresetBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'name';
    yield serializers.serialize(
      object.name,
      specifiedType: const FullType(String),
    );
    yield r'filters';
    yield serializers.serialize(
      object.filters,
      specifiedType: const FullType(FilterPresetFilters),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateFilterPresetBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateFilterPresetBodyBuilder result,
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
        case r'filters':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(FilterPresetFilters),
          ) as FilterPresetFilters;
          result.filters.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateFilterPresetBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateFilterPresetBodyBuilder();
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

