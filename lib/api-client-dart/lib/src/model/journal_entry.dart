//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'journal_entry.g.dart';

/// A single manual trade-journal entry (task #161). Prices are returned as strings to preserve the exact precision the user typed.
///
/// Properties:
/// * [id] 
/// * [analysisId] - Optional FK to the originating analysis. Nulled out (but row preserved) if the analysis is later deleted.
/// * [instrument] 
/// * [side] 
/// * [entryPrice] 
/// * [exitPrice] 
/// * [quantity] 
/// * [pnlAmount] - Auto-computed from (exit - entry) * direction * quantity unless the user overrode it.
/// * [pnlPercent] - Auto-computed from (exit - entry) / entry * 100 (signed by side) unless the user overrode it.
/// * [outcome] 
/// * [mood] 
/// * [note] 
/// * [tradedAt] 
/// * [createdAt] 
/// * [updatedAt] 
@BuiltValue()
abstract class JournalEntry implements Built<JournalEntry, JournalEntryBuilder> {
  @BuiltValueField(wireName: r'id')
  int get id;

  /// Optional FK to the originating analysis. Nulled out (but row preserved) if the analysis is later deleted.
  @BuiltValueField(wireName: r'analysisId')
  int? get analysisId;

  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'side')
  JournalEntrySideEnum get side;
  // enum sideEnum {  buy,  sell,  };

  @BuiltValueField(wireName: r'entryPrice')
  String? get entryPrice;

  @BuiltValueField(wireName: r'exitPrice')
  String? get exitPrice;

  @BuiltValueField(wireName: r'quantity')
  String? get quantity;

  /// Auto-computed from (exit - entry) * direction * quantity unless the user overrode it.
  @BuiltValueField(wireName: r'pnlAmount')
  String? get pnlAmount;

  /// Auto-computed from (exit - entry) / entry * 100 (signed by side) unless the user overrode it.
  @BuiltValueField(wireName: r'pnlPercent')
  String? get pnlPercent;

  @BuiltValueField(wireName: r'outcome')
  JournalEntryOutcomeEnum get outcome;
  // enum outcomeEnum {  win,  loss,  breakeven,  open,  skipped,  };

  @BuiltValueField(wireName: r'mood')
  String? get mood;

  @BuiltValueField(wireName: r'note')
  String? get note;

  @BuiltValueField(wireName: r'tradedAt')
  DateTime get tradedAt;

  @BuiltValueField(wireName: r'createdAt')
  DateTime get createdAt;

  @BuiltValueField(wireName: r'updatedAt')
  DateTime get updatedAt;

  JournalEntry._();

  factory JournalEntry([void updates(JournalEntryBuilder b)]) = _$JournalEntry;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(JournalEntryBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<JournalEntry> get serializer => _$JournalEntrySerializer();
}

class _$JournalEntrySerializer implements PrimitiveSerializer<JournalEntry> {
  @override
  final Iterable<Type> types = const [JournalEntry, _$JournalEntry];

  @override
  final String wireName = r'JournalEntry';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    JournalEntry object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    yield r'id';
    yield serializers.serialize(
      object.id,
      specifiedType: const FullType(int),
    );
    if (object.analysisId != null) {
      yield r'analysisId';
      yield serializers.serialize(
        object.analysisId,
        specifiedType: const FullType(int),
      );
    }
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'side';
    yield serializers.serialize(
      object.side,
      specifiedType: const FullType(JournalEntrySideEnum),
    );
    if (object.entryPrice != null) {
      yield r'entryPrice';
      yield serializers.serialize(
        object.entryPrice,
        specifiedType: const FullType(String),
      );
    }
    if (object.exitPrice != null) {
      yield r'exitPrice';
      yield serializers.serialize(
        object.exitPrice,
        specifiedType: const FullType(String),
      );
    }
    if (object.quantity != null) {
      yield r'quantity';
      yield serializers.serialize(
        object.quantity,
        specifiedType: const FullType(String),
      );
    }
    if (object.pnlAmount != null) {
      yield r'pnlAmount';
      yield serializers.serialize(
        object.pnlAmount,
        specifiedType: const FullType(String),
      );
    }
    if (object.pnlPercent != null) {
      yield r'pnlPercent';
      yield serializers.serialize(
        object.pnlPercent,
        specifiedType: const FullType(String),
      );
    }
    yield r'outcome';
    yield serializers.serialize(
      object.outcome,
      specifiedType: const FullType(JournalEntryOutcomeEnum),
    );
    if (object.mood != null) {
      yield r'mood';
      yield serializers.serialize(
        object.mood,
        specifiedType: const FullType(String),
      );
    }
    if (object.note != null) {
      yield r'note';
      yield serializers.serialize(
        object.note,
        specifiedType: const FullType(String),
      );
    }
    yield r'tradedAt';
    yield serializers.serialize(
      object.tradedAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'createdAt';
    yield serializers.serialize(
      object.createdAt,
      specifiedType: const FullType(DateTime),
    );
    yield r'updatedAt';
    yield serializers.serialize(
      object.updatedAt,
      specifiedType: const FullType(DateTime),
    );
  }

  @override
  Object serialize(
    Serializers serializers,
    JournalEntry object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required JournalEntryBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'id':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(int),
          ) as int;
          result.id = valueDes;
          break;
        case r'analysisId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.analysisId = valueDes;
          break;
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
          break;
        case r'side':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JournalEntrySideEnum),
          ) as JournalEntrySideEnum;
          result.side = valueDes;
          break;
        case r'entryPrice':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.entryPrice = valueDes;
          break;
        case r'exitPrice':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.exitPrice = valueDes;
          break;
        case r'quantity':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.quantity = valueDes;
          break;
        case r'pnlAmount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.pnlAmount = valueDes;
          break;
        case r'pnlPercent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.pnlPercent = valueDes;
          break;
        case r'outcome':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(JournalEntryOutcomeEnum),
          ) as JournalEntryOutcomeEnum;
          result.outcome = valueDes;
          break;
        case r'mood':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.mood = valueDes;
          break;
        case r'note':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.note = valueDes;
          break;
        case r'tradedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.tradedAt = valueDes;
          break;
        case r'createdAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.createdAt = valueDes;
          break;
        case r'updatedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(DateTime),
          ) as DateTime;
          result.updatedAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  JournalEntry deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = JournalEntryBuilder();
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

class JournalEntrySideEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'buy')
  static const JournalEntrySideEnum buy = _$journalEntrySideEnum_buy;
  @BuiltValueEnumConst(wireName: r'sell')
  static const JournalEntrySideEnum sell = _$journalEntrySideEnum_sell;

  static Serializer<JournalEntrySideEnum> get serializer => _$journalEntrySideEnumSerializer;

  const JournalEntrySideEnum._(String name): super(name);

  static BuiltSet<JournalEntrySideEnum> get values => _$journalEntrySideEnumValues;
  static JournalEntrySideEnum valueOf(String name) => _$journalEntrySideEnumValueOf(name);
}

class JournalEntryOutcomeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'win')
  static const JournalEntryOutcomeEnum win = _$journalEntryOutcomeEnum_win;
  @BuiltValueEnumConst(wireName: r'loss')
  static const JournalEntryOutcomeEnum loss = _$journalEntryOutcomeEnum_loss;
  @BuiltValueEnumConst(wireName: r'breakeven')
  static const JournalEntryOutcomeEnum breakeven = _$journalEntryOutcomeEnum_breakeven;
  @BuiltValueEnumConst(wireName: r'open')
  static const JournalEntryOutcomeEnum open = _$journalEntryOutcomeEnum_open;
  @BuiltValueEnumConst(wireName: r'skipped')
  static const JournalEntryOutcomeEnum skipped = _$journalEntryOutcomeEnum_skipped;

  static Serializer<JournalEntryOutcomeEnum> get serializer => _$journalEntryOutcomeEnumSerializer;

  const JournalEntryOutcomeEnum._(String name): super(name);

  static BuiltSet<JournalEntryOutcomeEnum> get values => _$journalEntryOutcomeEnumValues;
  static JournalEntryOutcomeEnum valueOf(String name) => _$journalEntryOutcomeEnumValueOf(name);
}

