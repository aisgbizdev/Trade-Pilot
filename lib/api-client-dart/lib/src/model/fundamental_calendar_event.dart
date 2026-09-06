//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'fundamental_calendar_event.g.dart';

/// A single economic-calendar event included in the fundamental snapshot persisted on an analysis row.
///
/// Properties:
/// * [date] 
/// * [time] 
/// * [currency] 
/// * [event] 
/// * [impact] - Star-rating string from the upstream feed: ★, ★★ or ★★★. Null when impact is unknown.
/// * [actual] 
/// * [forecast] 
/// * [previous] 
@BuiltValue()
abstract class FundamentalCalendarEvent implements Built<FundamentalCalendarEvent, FundamentalCalendarEventBuilder> {
  @BuiltValueField(wireName: r'date')
  String get date;

  @BuiltValueField(wireName: r'time')
  String get time;

  @BuiltValueField(wireName: r'currency')
  String get currency;

  @BuiltValueField(wireName: r'event')
  String get event;

  /// Star-rating string from the upstream feed: ★, ★★ or ★★★. Null when impact is unknown.
  @BuiltValueField(wireName: r'impact')
  String get impact;

  @BuiltValueField(wireName: r'actual')
  String get actual;

  @BuiltValueField(wireName: r'forecast')
  String get forecast;

  @BuiltValueField(wireName: r'previous')
  String get previous;

  FundamentalCalendarEvent._();

  factory FundamentalCalendarEvent([void updates(FundamentalCalendarEventBuilder b)]) = _$FundamentalCalendarEvent;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FundamentalCalendarEventBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FundamentalCalendarEvent> get serializer => _$FundamentalCalendarEventSerializer();
}

class _$FundamentalCalendarEventSerializer implements PrimitiveSerializer<FundamentalCalendarEvent> {
  @override
  final Iterable<Type> types = const [FundamentalCalendarEvent, _$FundamentalCalendarEvent];

  @override
  final String wireName = r'FundamentalCalendarEvent';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FundamentalCalendarEvent object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'date';
    yield serializers.serialize(
      object.date,
      specifiedType: const FullType(String),
    );
    yield r'time';
    yield serializers.serialize(
      object.time,
      specifiedType: const FullType(String),
    );
    yield r'currency';
    yield serializers.serialize(
      object.currency,
      specifiedType: const FullType(String),
    );
    yield r'event';
    yield serializers.serialize(
      object.event,
      specifiedType: const FullType(String),
    );
    yield r'impact';
    yield serializers.serialize(
      object.impact,
      specifiedType: const FullType(String),
    );
    yield r'actual';
    yield serializers.serialize(
      object.actual,
      specifiedType: const FullType(String),
    );
    yield r'forecast';
    yield serializers.serialize(
      object.forecast,
      specifiedType: const FullType(String),
    );
    yield r'previous';
    yield serializers.serialize(
      object.previous,
      specifiedType: const FullType(String),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    FundamentalCalendarEvent object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FundamentalCalendarEventBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'date':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.date = valueDes;
          break;
        case r'time':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.time = valueDes;
          break;
        case r'currency':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.currency = valueDes;
          break;
        case r'event':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.event = valueDes;
          break;
        case r'impact':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.impact = valueDes;
          break;
        case r'actual':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.actual = valueDes;
          break;
        case r'forecast':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.forecast = valueDes;
          break;
        case r'previous':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.previous = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  FundamentalCalendarEvent deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FundamentalCalendarEventBuilder();
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

