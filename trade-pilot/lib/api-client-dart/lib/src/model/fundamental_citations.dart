//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'fundamental_citations.g.dart';

/// Provenance trail emitted by the AI: the news headlines + economic-calendar event names it actually leaned on while writing the narrative. Lets the UI inline-cite the cards next to the relevant sentence (task #89).
///
/// Properties:
/// * [newsTitles] - News headlines the AI cited (matched against the snapshot in fundamentalContext.newsItems).
/// * [calendarEvents] - Calendar event names the AI cited (matched against the snapshot in fundamentalContext.calendarEvents).
@BuiltValue()
abstract class FundamentalCitations implements Built<FundamentalCitations, FundamentalCitationsBuilder> {
  /// News headlines the AI cited (matched against the snapshot in fundamentalContext.newsItems).
  @BuiltValueField(wireName: r'newsTitles')
  BuiltList<String> get newsTitles;

  /// Calendar event names the AI cited (matched against the snapshot in fundamentalContext.calendarEvents).
  @BuiltValueField(wireName: r'calendarEvents')
  BuiltList<String> get calendarEvents;

  FundamentalCitations._();

  factory FundamentalCitations([void updates(FundamentalCitationsBuilder b)]) = _$FundamentalCitations;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FundamentalCitationsBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FundamentalCitations> get serializer => _$FundamentalCitationsSerializer();
}

class _$FundamentalCitationsSerializer implements PrimitiveSerializer<FundamentalCitations> {
  @override
  final Iterable<Type> types = const [FundamentalCitations, _$FundamentalCitations];

  @override
  final String wireName = r'FundamentalCitations';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FundamentalCitations object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'newsTitles';
    yield serializers.serialize(
      object.newsTitles,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
    yield r'calendarEvents';
    yield serializers.serialize(
      object.calendarEvents,
      specifiedType: const FullType(BuiltList, [FullType(String)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    FundamentalCitations object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FundamentalCitationsBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'newsTitles':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.newsTitles.replace(valueDes);
          break;
        case r'calendarEvents':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(String)]),
          ) as BuiltList<String>;
          result.calendarEvents.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  FundamentalCitations deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FundamentalCitationsBuilder();
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

