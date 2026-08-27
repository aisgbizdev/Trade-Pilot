//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
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

