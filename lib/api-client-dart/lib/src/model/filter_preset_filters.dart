//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'filter_preset_filters.g.dart';

/// Mirrors the URL-derived filter state used by the history page.
///
/// Properties:
/// * [mode] 
/// * [instruments] 
/// * [timeframes] 
/// * [from] 
/// * [to] 
/// * [q] 
@BuiltValue()
abstract class FilterPresetFilters implements Built<FilterPresetFilters, FilterPresetFiltersBuilder> {
  @BuiltValueField(wireName: r'mode')
  FilterPresetFiltersModeEnum get mode;
  // enum modeEnum {  ,  beginner,  pro,  };

  @BuiltValueField(wireName: r'instruments')
  BuiltList<String> get instruments;

  @BuiltValueField(wireName: r'timeframes')
  BuiltList<String> get timeframes;

  @BuiltValueField(wireName: r'from')
  String get from;

  @BuiltValueField(wireName: r'to')
  String get to;

  @BuiltValueField(wireName: r'q')
  String get q;

  FilterPresetFilters._();

  factory FilterPresetFilters([void updates(FilterPresetFiltersBuilder b)]) = _$FilterPresetFilters;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FilterPresetFiltersBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FilterPresetFilters> get serializer => _$FilterPresetFiltersSerializer();
}

class _$FilterPresetFiltersSerializer implements PrimitiveSerializer<FilterPresetFilters> {
  @override
  final Iterable<Type> types = const [FilterPresetFilters, _$FilterPresetFilters];

  @override
  final String wireName = r'FilterPresetFilters';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FilterPresetFilters object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'mode';
    yield serializers.serialize(
      object.mode,
      specifiedType: const FullType(FilterPresetFiltersModeEnum),
    );
    yield r'instruments';
    yield serializers.serialize(
      object.instruments,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
    yield r'timeframes';
    yield serializers.serialize(
      object.timeframes,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
    yield r'from';
    yield serializers.serialize(
      object.from,
      specifiedType: const FullType(String),
    );
    yield r'to';
    yield serializers.serialize(
      object.to,
      specifiedType: const FullType(String),
    );
    yield r'q';
    yield serializers.serialize(
      object.q,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    FilterPresetFilters object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FilterPresetFiltersBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'mode':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(FilterPresetFiltersModeEnum),
          ) as FilterPresetFiltersModeEnum;
          result.mode = valueDes;
          break;
        case r'instruments':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.instruments.replace(valueDes);
          break;
        case r'timeframes':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.timeframes.replace(valueDes);
          break;
        case r'from':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.from = valueDes;
          break;
        case r'to':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.to = valueDes;
          break;
        case r'q':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.q = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  FilterPresetFilters deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FilterPresetFiltersBuilder();
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

class FilterPresetFiltersModeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'')
  static const FilterPresetFiltersModeEnum empty = _$filterPresetFiltersModeEnum_empty;
  @BuiltValueEnumConst(wireName: r'beginner')
  static const FilterPresetFiltersModeEnum beginner = _$filterPresetFiltersModeEnum_beginner;
  @BuiltValueEnumConst(wireName: r'pro')
  static const FilterPresetFiltersModeEnum pro = _$filterPresetFiltersModeEnum_pro;

  static Serializer<FilterPresetFiltersModeEnum> get serializer => _$filterPresetFiltersModeEnumSerializer;

  const FilterPresetFiltersModeEnum._(String name): super(name);

  static BuiltSet<FilterPresetFiltersModeEnum> get values => _$filterPresetFiltersModeEnumValues;
  static FilterPresetFiltersModeEnum valueOf(String name) => _$filterPresetFiltersModeEnumValueOf(name);
}

