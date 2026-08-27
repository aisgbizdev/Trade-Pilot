//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_calendar_event.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_news_item.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'fundamental_context.g.dart';

/// Snapshot of fundamental inputs the AI saw at analysis time.
///
/// Properties:
/// * [newsItems] 
/// * [calendarEvents] 
@BuiltValue()
abstract class FundamentalContext implements Built<FundamentalContext, FundamentalContextBuilder> {
  @BuiltValueField(wireName: r'newsItems')
  BuiltList<FundamentalNewsItem> get newsItems;

  @BuiltValueField(wireName: r'calendarEvents')
  BuiltList<FundamentalCalendarEvent> get calendarEvents;

  FundamentalContext._();

  factory FundamentalContext([void updates(FundamentalContextBuilder b)]) = _$FundamentalContext;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(FundamentalContextBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<FundamentalContext> get serializer => _$FundamentalContextSerializer();
}

class _$FundamentalContextSerializer implements PrimitiveSerializer<FundamentalContext> {
  @override
  final Iterable<Type> types = const [FundamentalContext, _$FundamentalContext];

  @override
  final String wireName = r'FundamentalContext';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    FundamentalContext object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'newsItems';
    yield serializers.serialize(
      object.newsItems,
      specifiedType: const FullType(BuiltList, [FullType(FundamentalNewsItem)]),
    );
    yield r'calendarEvents';
    yield serializers.serialize(
      object.calendarEvents,
      specifiedType: const FullType(BuiltList, [FullType(FundamentalCalendarEvent)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    FundamentalContext object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required FundamentalContextBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'newsItems':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(FundamentalNewsItem)]),
          ) as BuiltList<FundamentalNewsItem>;
          result.newsItems.replace(valueDes);
          break;
        case r'calendarEvents':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(FundamentalCalendarEvent)]),
          ) as BuiltList<FundamentalCalendarEvent>;
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
  FundamentalContext deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = FundamentalContextBuilder();
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

