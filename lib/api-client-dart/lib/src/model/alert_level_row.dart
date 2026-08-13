//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'alert_level_row.g.dart';

/// AlertLevelRow
///
/// Properties:
/// * [level] 
/// * [side] 
/// * [price] - AI-generated level price, stored verbatim for precision.
/// * [direction] - Which way price must move from the spot at arm time to fire the alert. `above` = fire when live ≥ price; `below` = fire when live ≤ price. 
/// * [triggeredAt] 
/// * [triggeredPrice] - Live price the watcher saw when it fired the alert.
/// * [cancelledAt] 
@BuiltValue()
abstract class AlertLevelRow implements Built<AlertLevelRow, AlertLevelRowBuilder> {
  @BuiltValueField(wireName: r'level')
  AlertLevelRowLevelEnum get level;
  // enum levelEnum {  entry,  sl,  tp1,  tp2,  };

  @BuiltValueField(wireName: r'side')
  AlertLevelRowSideEnum get side;
  // enum sideEnum {  buy,  sell,  };

  /// AI-generated level price, stored verbatim for precision.
  @BuiltValueField(wireName: r'price')
  String get price;

  /// Which way price must move from the spot at arm time to fire the alert. `above` = fire when live ≥ price; `below` = fire when live ≤ price. 
  @BuiltValueField(wireName: r'direction')
  AlertLevelRowDirectionEnum get direction;
  // enum directionEnum {  above,  below,  };

  @BuiltValueField(wireName: r'triggeredAt')
  DateTime get triggeredAt;

  /// Live price the watcher saw when it fired the alert.
  @BuiltValueField(wireName: r'triggeredPrice')
  String get triggeredPrice;

  @BuiltValueField(wireName: r'cancelledAt')
  DateTime get cancelledAt;

  AlertLevelRow._();

  factory AlertLevelRow([void updates(AlertLevelRowBuilder b)]) = _$AlertLevelRow;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(AlertLevelRowBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<AlertLevelRow> get serializer => _$AlertLevelRowSerializer();
}

class _$AlertLevelRowSerializer implements PrimitiveSerializer<AlertLevelRow> {
  @override
  final Iterable<Type> types = const [AlertLevelRow, _$AlertLevelRow];

  @override
  final String wireName = r'AlertLevelRow';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    AlertLevelRow object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'level';
    yield serializers.serialize(
      object.level,
      specifiedType: const FullType(AlertLevelRowLevelEnum),
    );
    yield r'side';
    yield serializers.serialize(
      object.side,
      specifiedType: const FullType(AlertLevelRowSideEnum),
    );
    yield r'price';
    yield serializers.serialize(
      object.price,
      specifiedType: const FullType(String),
    );
    yield r'direction';
    yield serializers.serialize(
      object.direction,
      specifiedType: const FullType(AlertLevelRowDirectionEnum),
    );
    yield r'triggeredAt';
    yield serializers.serialize(
      object.triggeredAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'triggeredPrice';
    yield serializers.serialize(
      object.triggeredPrice,
      specifiedType: const FullType(String),
    );
    yield r'cancelledAt';
    yield serializers.serialize(
      object.cancelledAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    AlertLevelRow object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required AlertLevelRowBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'level':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(AlertLevelRowLevelEnum),
          ) as AlertLevelRowLevelEnum;
          result.level = valueDes;
          break;
        case r'side':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(AlertLevelRowSideEnum),
          ) as AlertLevelRowSideEnum;
          result.side = valueDes;
          break;
        case r'price':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.price = valueDes;
          break;
        case r'direction':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(AlertLevelRowDirectionEnum),
          ) as AlertLevelRowDirectionEnum;
          result.direction = valueDes;
          break;
        case r'triggeredAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.triggeredAt = valueDes;
          break;
        case r'triggeredPrice':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.triggeredPrice = valueDes;
          break;
        case r'cancelledAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.cancelledAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  AlertLevelRow deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = AlertLevelRowBuilder();
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

class AlertLevelRowLevelEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'entry')
  static const AlertLevelRowLevelEnum entry = _$alertLevelRowLevelEnum_entry;
  @BuiltValueEnumConst(wireName: r'sl')
  static const AlertLevelRowLevelEnum sl = _$alertLevelRowLevelEnum_sl;
  @BuiltValueEnumConst(wireName: r'tp1')
  static const AlertLevelRowLevelEnum tp1 = _$alertLevelRowLevelEnum_tp1;
  @BuiltValueEnumConst(wireName: r'tp2')
  static const AlertLevelRowLevelEnum tp2 = _$alertLevelRowLevelEnum_tp2;

  static Serializer<AlertLevelRowLevelEnum> get serializer => _$alertLevelRowLevelEnumSerializer;

  const AlertLevelRowLevelEnum._(String name): super(name);

  static BuiltSet<AlertLevelRowLevelEnum> get values => _$alertLevelRowLevelEnumValues;
  static AlertLevelRowLevelEnum valueOf(String name) => _$alertLevelRowLevelEnumValueOf(name);
}

class AlertLevelRowSideEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'buy')
  static const AlertLevelRowSideEnum buy = _$alertLevelRowSideEnum_buy;
  @BuiltValueEnumConst(wireName: r'sell')
  static const AlertLevelRowSideEnum sell = _$alertLevelRowSideEnum_sell;

  static Serializer<AlertLevelRowSideEnum> get serializer => _$alertLevelRowSideEnumSerializer;

  const AlertLevelRowSideEnum._(String name): super(name);

  static BuiltSet<AlertLevelRowSideEnum> get values => _$alertLevelRowSideEnumValues;
  static AlertLevelRowSideEnum valueOf(String name) => _$alertLevelRowSideEnumValueOf(name);
}

class AlertLevelRowDirectionEnum extends EnumClass {

  /// Which way price must move from the spot at arm time to fire the alert. `above` = fire when live ≥ price; `below` = fire when live ≤ price. 
  @BuiltValueEnumConst(wireName: r'above')
  static const AlertLevelRowDirectionEnum above = _$alertLevelRowDirectionEnum_above;
  /// Which way price must move from the spot at arm time to fire the alert. `above` = fire when live ≥ price; `below` = fire when live ≤ price. 
  @BuiltValueEnumConst(wireName: r'below')
  static const AlertLevelRowDirectionEnum below = _$alertLevelRowDirectionEnum_below;

  static Serializer<AlertLevelRowDirectionEnum> get serializer => _$alertLevelRowDirectionEnumSerializer;

  const AlertLevelRowDirectionEnum._(String name): super(name);

  static BuiltSet<AlertLevelRowDirectionEnum> get values => _$alertLevelRowDirectionEnumValues;
  static AlertLevelRowDirectionEnum valueOf(String name) => _$alertLevelRowDirectionEnumValueOf(name);
}

