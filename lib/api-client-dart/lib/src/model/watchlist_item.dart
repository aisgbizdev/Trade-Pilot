//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'watchlist_item.g.dart';

/// WatchlistItem
///
/// Properties:
/// * [instrument] 
/// * [addedAt] 
/// * [mostRecentAnalysisId] - ID of the user's most recent analysis for this instrument, or null if none exists.
/// * [mostRecentAnalysisAt] - Created-at of the most recent analysis for this instrument, or null if none exists.
@BuiltValue()
abstract class WatchlistItem implements Built<WatchlistItem, WatchlistItemBuilder> {
  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'addedAt')
  DateTime get addedAt;

  /// ID of the user's most recent analysis for this instrument, or null if none exists.
  @BuiltValueField(wireName: r'mostRecentAnalysisId')
  int? get mostRecentAnalysisId;

  /// Created-at of the most recent analysis for this instrument, or null if none exists.
  @BuiltValueField(wireName: r'mostRecentAnalysisAt')
  DateTime? get mostRecentAnalysisAt;

  WatchlistItem._();

  factory WatchlistItem([void updates(WatchlistItemBuilder b)]) = _$WatchlistItem;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(WatchlistItemBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<WatchlistItem> get serializer => _$WatchlistItemSerializer();
}

class _$WatchlistItemSerializer implements PrimitiveSerializer<WatchlistItem> {
  @override
  final Iterable<Type> types = const [WatchlistItem, _$WatchlistItem];

  @override
  final String wireName = r'WatchlistItem';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    WatchlistItem object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'addedAt';
    yield serializers.serialize(
      object.addedAt,
      specifiedType: const FullType(DateTime),
    );
    if (object.mostRecentAnalysisId != null) {
      yield r'mostRecentAnalysisId';
      yield serializers.serialize(
        object.mostRecentAnalysisId,
        specifiedType: const FullType(int),
      );
    }
    if (object.mostRecentAnalysisAt != null) {
      yield r'mostRecentAnalysisAt';
      yield serializers.serialize(
        object.mostRecentAnalysisAt,
        specifiedType: const FullType(DateTime),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    WatchlistItem object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required WatchlistItemBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
          break;
        case r'addedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.addedAt = valueDes;
          break;
        case r'mostRecentAnalysisId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.mostRecentAnalysisId = valueDes;
          break;
        case r'mostRecentAnalysisAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.mostRecentAnalysisAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  WatchlistItem deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = WatchlistItemBuilder();
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

