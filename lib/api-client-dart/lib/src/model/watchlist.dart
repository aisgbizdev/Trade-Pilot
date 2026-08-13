//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/watchlist_item.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'watchlist.g.dart';

/// Watchlist
///
/// Properties:
/// * [items] 
@BuiltValue()
abstract class Watchlist implements Built<Watchlist, WatchlistBuilder> {
  @BuiltValueField(wireName: r'items')
  BuiltList<WatchlistItem> get items;

  Watchlist._();

  factory Watchlist([void updates(WatchlistBuilder b)]) = _$Watchlist;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(WatchlistBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<Watchlist> get serializer => _$WatchlistSerializer();
}

class _$WatchlistSerializer implements PrimitiveSerializer<Watchlist> {
  @override
  final Iterable<Type> types = const [Watchlist, _$Watchlist];

  @override
  final String wireName = r'Watchlist';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    Watchlist object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'items';
    yield serializers.serialize(
      object.items,
      specifiedType: const FullType(BuiltList, [FullType(WatchlistItem)]),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    Watchlist object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required WatchlistBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'items':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(BuiltList, [FullType(WatchlistItem)]),
          ) as BuiltList<WatchlistItem>;
          result.items.replace(valueDes);
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  Watchlist deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = WatchlistBuilder();
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

