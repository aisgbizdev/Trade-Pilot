//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'trader_mirror_highlight.g.dart';

/// Short bilingual one-liner pulled from the insights bundle. Used for both the dashboard hero strip and the weekly trader-report push. `id` is the stable highlight key; `en` and `idText` are the English and Indonesian copy.
///
/// Properties:
/// * [id] 
/// * [en] 
/// * [idText] 
@BuiltValue()
abstract class TraderMirrorHighlight implements Built<TraderMirrorHighlight, TraderMirrorHighlightBuilder> {
  @BuiltValueField(wireName: r'id')
  String get id;

  @BuiltValueField(wireName: r'en')
  String get en;

  @BuiltValueField(wireName: r'idText')
  String get idText;

  TraderMirrorHighlight._();

  factory TraderMirrorHighlight([void updates(TraderMirrorHighlightBuilder b)]) = _$TraderMirrorHighlight;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TraderMirrorHighlightBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TraderMirrorHighlight> get serializer => _$TraderMirrorHighlightSerializer();
}

class _$TraderMirrorHighlightSerializer implements PrimitiveSerializer<TraderMirrorHighlight> {
  @override
  final Iterable<Type> types = const [TraderMirrorHighlight, _$TraderMirrorHighlight];

  @override
  final String wireName = r'TraderMirrorHighlight';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TraderMirrorHighlight object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(String),
    );
    yield r'en';
    yield serializers.serialize(
      object.en,
      specifiedType: const FullType(String),
    );
    yield r'idText';
    yield serializers.serialize(
      object.idText,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TraderMirrorHighlight object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TraderMirrorHighlightBuilder result,
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
        case r'en':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.en = valueDes;
          break;
        case r'idText':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.idText = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TraderMirrorHighlight deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TraderMirrorHighlightBuilder();
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

