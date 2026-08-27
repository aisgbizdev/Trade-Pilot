//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/filter_preset.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'filter_preset_list.g.dart';

/// FilterPresetList
///
/// Properties:
/// * [presets] 
@BuiltValue()
abstract class FilterPresetList implements Built<FilterPresetList, FilterPresetListBuilder> {
  @BuiltValueField(wireName: r'presets')
  BuiltList<FilterPreset> get presets;

  FilterPresetList._();

  factory FilterPresetList([void updates(FilterPresetListBuilder b)]) = _$FilterPresetList;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FilterPresetListBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FilterPresetList> get serializer => _$FilterPresetListSerializer();
}

class _$FilterPresetListSerializer implements PrimitiveSerializer<FilterPresetList> {
  @override
  final Iterable<Type> types = const [FilterPresetList, _$FilterPresetList];

  @override
  final String wireName = r'FilterPresetList';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FilterPresetList object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'presets';
    yield serializers.serialize(
      object.presets,
      specifiedType: const FullType(BuiltList, [FullType(FilterPreset)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    FilterPresetList object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FilterPresetListBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'presets':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(FilterPreset)]),
          ) as BuiltList<FilterPreset>;
          result.presets.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  FilterPresetList deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FilterPresetListBuilder();
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

