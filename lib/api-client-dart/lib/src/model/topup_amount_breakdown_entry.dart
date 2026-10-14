//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'topup_amount_breakdown_entry.g.dart';

/// How many of a user's approved top-ups were for a given amount, e.g. { amountRupiah: 5000, count: 1 } + { amountRupiah: 20000, count: 2 } reads as \"5.000 1x, 20.000 2x\".
///
/// Properties:
/// * [amountRupiah] 
/// * [count] 
@BuiltValue()
abstract class TopupAmountBreakdownEntry implements Built<TopupAmountBreakdownEntry, TopupAmountBreakdownEntryBuilder> {
  @BuiltValueField(wireName: r'amountRupiah')
  int get amountRupiah;

  @BuiltValueField(wireName: r'count')
  int get count;

  TopupAmountBreakdownEntry._();

  factory TopupAmountBreakdownEntry([void updates(TopupAmountBreakdownEntryBuilder b)]) = _$TopupAmountBreakdownEntry;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(TopupAmountBreakdownEntryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<TopupAmountBreakdownEntry> get serializer => _$TopupAmountBreakdownEntrySerializer();
}

class _$TopupAmountBreakdownEntrySerializer implements PrimitiveSerializer<TopupAmountBreakdownEntry> {
  @override
  final Iterable<Type> types = const [TopupAmountBreakdownEntry, _$TopupAmountBreakdownEntry];

  @override
  final String wireName = r'TopupAmountBreakdownEntry';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    TopupAmountBreakdownEntry object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'amountRupiah';
    yield serializers.serialize(
      object.amountRupiah,
      specifiedType: const FullType(int),
    );
    yield r'count';
    yield serializers.serialize(
      object.count,
      specifiedType: const FullType(int),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    TopupAmountBreakdownEntry object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required TopupAmountBreakdownEntryBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'amountRupiah':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.amountRupiah = valueDes;
          break;
        case r'count':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.count = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  TopupAmountBreakdownEntry deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = TopupAmountBreakdownEntryBuilder();
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

