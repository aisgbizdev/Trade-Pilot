//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'fundamental_news_item.g.dart';

/// A single news headline included in the fundamental snapshot persisted on an analysis row. Captured from Newsmaker.id and Yahoo Finance RSS at analysis time.
///
/// Properties:
/// * [id] 
/// * [title] 
/// * [summary] 
/// * [source_] - Human-readable source label, e.g. 'Newsmaker.id' or 'Yahoo Finance'.
/// * [url] 
/// * [publishedAt] 
/// * [sourceTier] 
/// * [sourceLabels] 
/// * [sourceCount] 
/// * [relevanceScore] 
/// * [impact] 
@BuiltValue()
abstract class FundamentalNewsItem implements Built<FundamentalNewsItem, FundamentalNewsItemBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'title')
  String get title;

  @BuiltValueField(wireName: r'summary')
  String get summary;

  /// Human-readable source label, e.g. 'Newsmaker.id' or 'Yahoo Finance'.
  @BuiltValueField(wireName: r'source')
  String get source_;

  @BuiltValueField(wireName: r'url')
  String get url;

  @BuiltValueField(wireName: r'publishedAt')
  DateTime get publishedAt;

  @BuiltValueField(wireName: r'sourceTier')
  FundamentalNewsItemSourceTierEnum? get sourceTier;
  // enum sourceTierEnum {  primary,  standard,  licensed,  };

  @BuiltValueField(wireName: r'sourceLabels')
  BuiltList<String>? get sourceLabels;

  @BuiltValueField(wireName: r'sourceCount')
  int? get sourceCount;

  @BuiltValueField(wireName: r'relevanceScore')
  num? get relevanceScore;

  @BuiltValueField(wireName: r'impact')
  FundamentalNewsItemImpactEnum? get impact;
  // enum impactEnum {  low,  medium,  high,  };

  FundamentalNewsItem._();

  factory FundamentalNewsItem([void updates(FundamentalNewsItemBuilder b)]) = _$FundamentalNewsItem;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FundamentalNewsItemBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FundamentalNewsItem> get serializer => _$FundamentalNewsItemSerializer();
}

class _$FundamentalNewsItemSerializer implements PrimitiveSerializer<FundamentalNewsItem> {
  @override
  final Iterable<Type> types = const [FundamentalNewsItem, _$FundamentalNewsItem];

  @override
  final String wireName = r'FundamentalNewsItem';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FundamentalNewsItem object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'title';
    yield serializers.serialize(
      object.title,
      specifiedType: const FullType(String),
    );
    yield r'summary';
    yield serializers.serialize(
      object.summary,
      specifiedType: const FullType(String),
    );
    yield r'source';
    yield serializers.serialize(
      object.source_,
      specifiedType: const FullType(String),
    );
    yield r'url';
    yield serializers.serialize(
      object.url,
      specifiedType: const FullType(String),
    );
    yield r'publishedAt';
    yield serializers.serialize(
      object.publishedAt,
      specifiedType: const FullType(DateTime),
    );
    if (object.sourceTier != null) {
      yield r'sourceTier';
      yield serializers.serialize(
        object.sourceTier,
        specifiedType: const FullType(FundamentalNewsItemSourceTierEnum),
      );
    }
    if (object.sourceLabels != null) {
      yield r'sourceLabels';
      yield serializers.serialize(
        object.sourceLabels,
        specifiedType: const FullType(BuiltList, [FullType(String)]),
      );
    }
    if (object.sourceCount != null) {
      yield r'sourceCount';
      yield serializers.serialize(
        object.sourceCount,
        specifiedType: const FullType(int),
      );
    }
    if (object.relevanceScore != null) {
      yield r'relevanceScore';
      yield serializers.serialize(
        object.relevanceScore,
        specifiedType: const FullType(num),
      );
    }
    if (object.impact != null) {
      yield r'impact';
      yield serializers.serialize(
        object.impact,
        specifiedType: const FullType(FundamentalNewsItemImpactEnum),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    FundamentalNewsItem object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FundamentalNewsItemBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.id = valueDes;
          break;
        case r'title':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.title = valueDes;
          break;
        case r'summary':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.summary = valueDes;
          break;
        case r'source':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.source_ = valueDes;
          break;
        case r'url':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.url = valueDes;
          break;
        case r'publishedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.publishedAt = valueDes;
          break;
        case r'sourceTier':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(FundamentalNewsItemSourceTierEnum),
          ) as FundamentalNewsItemSourceTierEnum?;
          if (valueDes == null) continue;
          result.sourceTier = valueDes;
          break;
        case r'sourceLabels':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(String)]),
          ) as BuiltList<String>?;
          if (valueDes == null) continue;
          result.sourceLabels.replace(valueDes);
          break;
        case r'sourceCount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.sourceCount = valueDes;
          break;
        case r'relevanceScore':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(num),
          ) as num?;
          if (valueDes == null) continue;
          result.relevanceScore = valueDes;
          break;
        case r'impact':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(FundamentalNewsItemImpactEnum),
          ) as FundamentalNewsItemImpactEnum?;
          if (valueDes == null) continue;
          result.impact = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  FundamentalNewsItem deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FundamentalNewsItemBuilder();
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

class FundamentalNewsItemSourceTierEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'primary')
  static const FundamentalNewsItemSourceTierEnum primary = _$fundamentalNewsItemSourceTierEnum_primary;
  @BuiltValueEnumConst(wireName: r'standard')
  static const FundamentalNewsItemSourceTierEnum standard = _$fundamentalNewsItemSourceTierEnum_standard;
  @BuiltValueEnumConst(wireName: r'licensed')
  static const FundamentalNewsItemSourceTierEnum licensed = _$fundamentalNewsItemSourceTierEnum_licensed;

  static Serializer<FundamentalNewsItemSourceTierEnum> get serializer => _$fundamentalNewsItemSourceTierEnumSerializer;

  const FundamentalNewsItemSourceTierEnum._(String name): super(name);

  static BuiltSet<FundamentalNewsItemSourceTierEnum> get values => _$fundamentalNewsItemSourceTierEnumValues;
  static FundamentalNewsItemSourceTierEnum valueOf(String name) => _$fundamentalNewsItemSourceTierEnumValueOf(name);
}

class FundamentalNewsItemImpactEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'low')
  static const FundamentalNewsItemImpactEnum low = _$fundamentalNewsItemImpactEnum_low;
  @BuiltValueEnumConst(wireName: r'medium')
  static const FundamentalNewsItemImpactEnum medium = _$fundamentalNewsItemImpactEnum_medium;
  @BuiltValueEnumConst(wireName: r'high')
  static const FundamentalNewsItemImpactEnum high = _$fundamentalNewsItemImpactEnum_high;

  static Serializer<FundamentalNewsItemImpactEnum> get serializer => _$fundamentalNewsItemImpactEnumSerializer;

  const FundamentalNewsItemImpactEnum._(String name): super(name);

  static BuiltSet<FundamentalNewsItemImpactEnum> get values => _$fundamentalNewsItemImpactEnumValues;
  static FundamentalNewsItemImpactEnum valueOf(String name) => _$fundamentalNewsItemImpactEnumValueOf(name);
}

