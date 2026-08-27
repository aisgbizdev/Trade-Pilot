//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'fundamental_drift_citation.g.dart';

/// A single original AI citation that no longer matches anything in the freshly-fetched news/calendar window.
///
/// Properties:
/// * [kind] 
/// * [label] 
@BuiltValue()
abstract class FundamentalDriftCitation implements Built<FundamentalDriftCitation, FundamentalDriftCitationBuilder> {
  @BuiltValueField(wireName: r'kind')
  FundamentalDriftCitationKindEnum get kind;
  // enum kindEnum {  news,  calendar,  };

  @BuiltValueField(wireName: r'label')
  String get label;

  FundamentalDriftCitation._();

  factory FundamentalDriftCitation([void updates(FundamentalDriftCitationBuilder b)]) = _$FundamentalDriftCitation;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FundamentalDriftCitationBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FundamentalDriftCitation> get serializer => _$FundamentalDriftCitationSerializer();
}

class _$FundamentalDriftCitationSerializer implements PrimitiveSerializer<FundamentalDriftCitation> {
  @override
  final Iterable<Type> types = const [FundamentalDriftCitation, _$FundamentalDriftCitation];

  @override
  final String wireName = r'FundamentalDriftCitation';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FundamentalDriftCitation object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'kind';
    yield serializers.serialize(
      object.kind,
      specifiedType: const FullType(FundamentalDriftCitationKindEnum),
    );
    yield r'label';
    yield serializers.serialize(
      object.label,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    FundamentalDriftCitation object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FundamentalDriftCitationBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'kind':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(FundamentalDriftCitationKindEnum),
          ) as FundamentalDriftCitationKindEnum;
          result.kind = valueDes;
          break;
        case r'label':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.label = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  FundamentalDriftCitation deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FundamentalDriftCitationBuilder();
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

class FundamentalDriftCitationKindEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'news')
  static const FundamentalDriftCitationKindEnum news = _$fundamentalDriftCitationKindEnum_news;
  @BuiltValueEnumConst(wireName: r'calendar')
  static const FundamentalDriftCitationKindEnum calendar = _$fundamentalDriftCitationKindEnum_calendar;

  static Serializer<FundamentalDriftCitationKindEnum> get serializer => _$fundamentalDriftCitationKindEnumSerializer;

  const FundamentalDriftCitationKindEnum._(String name): super(name);

  static BuiltSet<FundamentalDriftCitationKindEnum> get values => _$fundamentalDriftCitationKindEnumValues;
  static FundamentalDriftCitationKindEnum valueOf(String name) => _$fundamentalDriftCitationKindEnumValueOf(name);
}

