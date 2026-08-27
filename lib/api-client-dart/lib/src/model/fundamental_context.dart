//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:trade_pilot_api_client/src/model/fundamental_news_source.dart';
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_calendar_event.dart';
import 'package:trade_pilot_api_client/src/model/fundamental_news_item.dart';
import 'package:trade_pilot_api_client/src/model/market_intelligence.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'fundamental_context.g.dart';

/// Snapshot of fundamental inputs the AI saw at analysis time.
///
/// Properties:
/// * [newsItems] 
/// * [calendarEvents] 
/// * [capturedAt] 
/// * [sourceStatuses] 
/// * [marketState] 
@BuiltValue()
abstract class FundamentalContext implements Built<FundamentalContext, FundamentalContextBuilder> {
  @BuiltValueField(wireName: r'newsItems')
  BuiltList<FundamentalNewsItem> get newsItems;

  @BuiltValueField(wireName: r'calendarEvents')
  BuiltList<FundamentalCalendarEvent> get calendarEvents;

  @BuiltValueField(wireName: r'capturedAt')
  DateTime? get capturedAt;

  @BuiltValueField(wireName: r'sourceStatuses')
  BuiltList<FundamentalNewsSource>? get sourceStatuses;

  @BuiltValueField(wireName: r'marketState')
  MarketIntelligence? get marketState;

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
    if (object.capturedAt != null) {
      yield r'capturedAt';
      yield serializers.serialize(
        object.capturedAt,
        specifiedType: const FullType(DateTime),
      );
    }
    if (object.sourceStatuses != null) {
      yield r'sourceStatuses';
      yield serializers.serialize(
        object.sourceStatuses,
        specifiedType: const FullType(BuiltList, [FullType(FundamentalNewsSource)]),
      );
    }
    if (object.marketState != null) {
      yield r'marketState';
      yield serializers.serialize(
        object.marketState,
        specifiedType: const FullType(MarketIntelligence),
      );
    }
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
        case r'capturedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.capturedAt = valueDes;
          break;
        case r'sourceStatuses':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(BuiltList, [FullType(FundamentalNewsSource)]),
          ) as BuiltList<FundamentalNewsSource>?;
          if (valueDes == null) continue;
          result.sourceStatuses.replace(valueDes);
          break;
        case r'marketState':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(MarketIntelligence),
          ) as MarketIntelligence?;
          if (valueDes == null) continue;
          result.marketState.replace(valueDes);
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

